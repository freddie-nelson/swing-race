import Entity from "blaze-2d/lib/src/entity";
import RectCollider from "blaze-2d/lib/src/physics/collider/rect";
import Rect from "blaze-2d/lib/src/shapes/rect";
import Texture from "blaze-2d/lib/src/texture/texture";
import { vec2 } from "gl-matrix";

export default class Tile extends Entity {
  constructor(pos: vec2, rot: number, texture: Texture) {
    super(pos, new RectCollider(TILE_SIZE, TILE_SIZE), [], TILE_MASS, "tile");
    this.setRotation(rot);

    const rect = new Rect(TILE_SIZE + TILE_SLOP, TILE_SIZE + TILE_SLOP);
    rect.texture = texture;
    this.addPiece(rect);
  }
}
