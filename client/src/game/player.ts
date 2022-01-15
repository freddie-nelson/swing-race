import Entity from "@blz/entity";
import Rect from "@blz/shapes/rect";
import Circle from "@blz/shapes/circle";
import CircleCollider from "@blz/physics/collider/circle";
import DistanceConstraint from "@blz/physics/constraints/distance";
import { vec2 } from "gl-matrix";
import { Mouse } from "@blz/input/mouse";
import { cross2DWithScalar } from "@blz/utils/vectors";
import RectCollider from "blaze-2d/lib/src/physics/collider/rect";
import Line from "blaze-2d/lib/src/shapes/line";
import Blaze from "blaze-2d/lib/src/blaze";
import Ray from "blaze-2d/lib/src/physics/ray";
import Game from "./game";
import World from "blaze-2d/lib/src/world";

export default class Player {
  ball: Entity;
  followCam = false;
  isOnGround = false;
  rollForce = 2.5;

  barWidth = BALL_RADIUS * 6;
  barHeight = BALL_RADIUS * 1.5;
  jumpForceBar: Rect;
  jumpForceContainer: Rect;
  jumpForceEntity: Entity;

  jumpForce = 0;
  jumpChargeSpeed = 1400;
  maxJumpForce = 700;

  trail: Entity;
  trailLength = 14;

  anchor: Entity;
  rod: Entity;
  grapple: DistanceConstraint | undefined;
  grappleBoost = 20;
  maxGrappleBoost = 50;

  maxVelocity = 30;

  color: string;

  private world = Blaze.getScene().world;
  private physics = Blaze.getScene().physics;

  constructor(color: string, controls = false, followCam = false) {
    this.color = color;
    this.followCam = followCam;

    const ballCircle = new Rect(BALL_RADIUS * 2, BALL_RADIUS * 2);
    ballCircle.texture = this.getBallTexture();
    this.ball = new Entity(vec2.create(), new CircleCollider(BALL_RADIUS), [ballCircle], BALL_MASS);
    this.ball.setInertia(BALL_MASS / 8);
    this.ball.setZIndex(1);
    this.ball.airFriction = 0.05;
    this.ball.addEventListener("update", this.ballListener);

    this.jumpForceBar = new Rect(this.barWidth, this.barHeight);
    this.jumpForceBar.texture = this.getRodTexture();
    this.jumpForceContainer = new Rect(this.barWidth + 0.16, this.barHeight + 0.15);
    this.jumpForceContainer.texture = this.getRodTexture();
    this.jumpForceContainer.opacity = 0.5;

    this.jumpForceEntity = new Entity(vec2.create(), new CircleCollider(0), [
      this.jumpForceContainer,
      this.jumpForceBar,
    ]);
    this.jumpForceEntity.setZIndex(1);

    this.trail = new Entity(vec2.create(), new CircleCollider(0));
    for (let i = 1; i <= this.trailLength; i++) {
      const trailSize = BALL_RADIUS * (1 - i * 0.05);
      const circle = new Circle(trailSize);
      circle.texture = this.getTrailTexture();
      this.trail.addPiece(circle);
    }
    this.trail.addEventListener("update", this.trailListener);

    const anchorCircle = new Rect(BALL_RADIUS, BALL_RADIUS);
    anchorCircle.texture = this.getAnchorTexture();
    this.anchor = new Entity(vec2.create(), new CircleCollider(0), [anchorCircle], 0);
    this.anchor.setZIndex(1);

    const rod = new Line(vec2.create(), vec2.create(), BALL_RADIUS / 4);
    rod.texture = this.getRodTexture();
    this.rod = new Entity(vec2.create(), new RectCollider(0, 0), [rod]);
    this.rod.addEventListener("update", this.rodListener);

    this.world.addEntities(this.ball, this.trail);
    this.physics.addBody(this.ball);

    // WORLD.addEntity(this.rod);
    // WORLD.addEntity(this.anchor);

    if (controls) CANVAS.mouse.addListener(Mouse.LEFT, this.mouseListener);
  }

  private addedJumpBar = false;

  ballListener = (delta: number) => {
    if (this.followCam) this.world.getCamera().setPosition(this.ball.getPosition());

    this.capVelocity();
    this.updateIsOnGround();

    if (this.isOnGround) {
      this.rollMovement(delta);
    } else {
      this.jumpForce = 0;
    }

    this.jumpForceEntity.setPosition(
      vec2.fromValues(this.ball.getPosition()[0], this.ball.getPosition()[1] + BALL_RADIUS * 3)
    );

    if (this.jumpForce > 0) {
      if (!this.addedJumpBar) {
        this.addedJumpBar = true;
        this.world.addEntity(this.jumpForceEntity);
      }

      const percentage = this.jumpForce / this.maxJumpForce;
      const width = this.barWidth * percentage;
      this.jumpForceBar.setWidth(width);
    } else if (this.addedJumpBar) {
      this.addedJumpBar = false;
      this.world.removeEntity(this.jumpForceEntity);
    }
  };

  private capVelocity() {
    const vel = this.ball.velocity;
    const mag = vec2.len(vel);
    if (mag > this.maxVelocity) {
      vec2.normalize(this.ball.velocity, this.ball.velocity);
      vec2.scale(this.ball.velocity, this.ball.velocity, this.maxVelocity);
    }
  }

  private updateIsOnGround() {
    const ray = new Ray(this.ball.getPosition(), vec2.fromValues(0, -1), BALL_RADIUS + BALL_RADIUS / 5);
    const bodies = this.physics.raycast(ray).filter((b) => b !== this.ball);

    this.isOnGround = bodies.length > 0;
  }

  private rollMovement(delta: number) {
    const keys = Blaze.getCanvas().keys;

    // left and right roll
    const force = vec2.create();
    if (keys.isPressed(Game.controls.rollLeft)) {
      force[0] -= this.rollForce;
    }
    if (keys.isPressed(Game.controls.rollRight)) {
      force[0] += this.rollForce;
    }

    this.ball.applyForce(force);

    // jump
    if (keys.isPressed(Game.controls.jump)) {
      this.jumpForce += this.jumpChargeSpeed * delta;
      this.jumpForce = Math.min(this.jumpForce, this.maxJumpForce);
    } else if (this.jumpForce > 0) {
      this.ball.applyForce(vec2.fromValues(0, this.jumpForce));
      this.jumpForce = 0;
    }
  }

  trailListener = (delta: number) => {
    const pieces = <Circle[]>[...this.trail.getPieces()];
    const head = pieces[0];
    const spacing = Math.min(BALL_RADIUS / 3, vec2.len(this.ball.velocity) / 10);

    const dir = vec2.normalize(vec2.create(), this.ball.velocity);
    vec2.negate(dir, dir);

    head.setPosition(this.ball.getPosition());
    head.translate(vec2.scale(vec2.create(), dir, spacing));

    for (let i = pieces.length - 1; i > 0; i--) {
      const piece = pieces[i];
      const next = pieces[i - 1];

      const dist = vec2.dist(piece.getPosition(), next.getPosition());

      if (dist > spacing) piece.setPosition(next.getPosition());
    }
  };

  rodListener = () => {
    if (this.grapple) {
      const line = <Line>this.rod.getPieces()[0];
      line.setEnd(this.ball.getPosition());
    }
  };

  mouseListener = (pressed: boolean, pos: vec2) => {
    if (pressed && !this.grapple) {
      const world = this.world.getWorldFromPixel(pos);

      this.anchor.setPosition(world);
      this.world.addEntity(this.anchor);

      const diff = vec2.sub(vec2.create(), world, this.ball.getPosition());
      const dist = vec2.len(diff);

      // find boost direction
      const right = vec2.fromValues(1, 0);
      let dir = Math.sign(vec2.dot(diff, right));
      if (dir === 0) dir = 1;

      const perp = cross2DWithScalar(vec2.create(), diff, dir);
      vec2.scale(perp, perp, Math.min(this.grappleBoost * Math.sqrt(dist), this.maxGrappleBoost));
      this.ball.applyForce(perp);

      const line = <Line>this.rod.getPieces()[0];
      line.setStart(world);
      this.world.addEntity(this.rod);

      this.grapple = new DistanceConstraint(this.ball, world, dist);
      this.physics.addConstraint(this.grapple);
    } else if (this.grapple) {
      this.world.removeEntity(this.anchor);
      this.world.removeEntity(this.rod);

      this.physics.removeConstraint(this.grapple);
      this.grapple = undefined;
    }
  };

  setColor(color: string) {
    this.color = color;

    const ball = this.ball.getPieces()[0];
    const anchor = this.anchor.getPieces()[0];
    const rod = this.rod.getPieces()[0];

    ball.texture = this.getBallTexture();
    anchor.texture = this.getAnchorTexture();
    rod.texture = this.getRodTexture();

    this.jumpForceBar.texture = this.getRodTexture();
    this.jumpForceContainer.texture = this.getRodTexture();

    for (const piece of this.trail.getPieces()) {
      piece.texture = this.getTrailTexture();
    }
  }

  getBallTexture() {
    return TEXTURES[`${this.color}Ball`];
  }

  getAnchorTexture() {
    return TEXTURES[`${this.color}Anchor`];
  }

  getRodTexture() {
    return TEXTURES[`${this.color}Rod`];
  }

  getTrailTexture() {
    return TEXTURES[`${this.color}Trail`];
  }
}
