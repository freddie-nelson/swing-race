import Entity from "blaze-2d/lib/src/entity";
import Circle from "blaze-2d/lib/src/shapes/circle";
import CircleCollider from "blaze-2d/lib/src/physics/collider/circle";
import DistanceConstraint from "blaze-2d/lib/src/physics/constraints/distance";
import { vec2 } from "gl-matrix";

export default class Player {
  ball: Entity;
  anchor: Entity;

  grapple: DistanceConstraint | undefined;

  constructor() {
    const ballCircle = new Circle(BALL_SIZE);
    ballCircle.texture = TEXTURES.blueBall;
    this.ball = new Entity(vec2.create(), new CircleCollider(BALL_SIZE), [ballCircle], BALL_MASS);

    const anchorCircle = new Circle(BALL_SIZE / 2);
    anchorCircle.texture = TEXTURES.blueAnchor;
    this.anchor = new Entity(vec2.create(), new CircleCollider(0), [anchorCircle], 0);

    WORLD.addEntities(this.ball);
    PHYSICS.addBodies(this.ball);
  }
}
