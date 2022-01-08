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
import BatchRenderer from "blaze-2d/lib/src/renderer/batchRenderer";

export default class Player {
  ball: Entity;

  trail: Entity;
  trailLength = 12;

  anchor: Entity;
  rod: Entity;
  grapple: DistanceConstraint | undefined;
  grappleBoost = 20;
  maxGrappleBoost = 50;

  color: string;

  constructor(color: string, controls = false) {
    this.color = color;

    const ballCircle = new Rect(BALL_SIZE * 2, BALL_SIZE * 2);
    ballCircle.texture = this.getBallTexture();
    this.ball = new Entity(vec2.create(), new CircleCollider(BALL_SIZE), [ballCircle], BALL_MASS);
    this.ball.setZIndex(1);
    this.ball.airFriction = 0.05;

    this.trail = new Entity(vec2.create(), new CircleCollider(0));
    for (let i = 1; i <= this.trailLength; i++) {
      const trailSize = BALL_SIZE * (1 - i * 0.05);
      const circle = new Circle(trailSize);
      circle.texture = this.getTrailTexture();
      this.trail.addPiece(circle);
    }
    this.trail.addEventListener("update", this.trailListener);

    const anchorCircle = new Rect(BALL_SIZE, BALL_SIZE);
    anchorCircle.texture = this.getAnchorTexture();
    this.anchor = new Entity(vec2.create(), new CircleCollider(0), [anchorCircle], 0);
    this.anchor.setZIndex(1);

    const rod = new Line(vec2.create(), vec2.create(), BALL_SIZE / 4);
    rod.texture = this.getRodTexture();
    this.rod = new Entity(vec2.create(), new RectCollider(0, 0), [rod]);
    this.rod.addEventListener("update", this.rodListener);

    WORLD.addEntities(this.ball, this.trail);
    PHYSICS.addBody(this.ball);

    // WORLD.addEntity(this.rod);
    // WORLD.addEntity(this.anchor);

    if (controls) CANVAS.mouse.addListener(Mouse.LEFT, this.mouseListener);
  }

  trailListener = (delta: number) => {
    const pieces = <Circle[]>[...this.trail.getPieces()];
    const head = pieces[0];
    const spacing = Math.min(BALL_SIZE / 3, vec2.len(this.ball.velocity) / 10);

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
      const world = WORLD.getWorldFromPixel(pos);

      this.anchor.setPosition(world);
      WORLD.addEntity(this.anchor);

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
      WORLD.addEntity(this.rod);

      this.grapple = new DistanceConstraint(this.ball, world, dist);
      PHYSICS.addConstraint(this.grapple);
    } else if (this.grapple) {
      WORLD.removeEntity(this.anchor);
      WORLD.removeEntity(this.rod);

      PHYSICS.removeConstraint(this.grapple);
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
