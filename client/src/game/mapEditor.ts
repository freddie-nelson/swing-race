import Blaze from "blaze-2d/lib/src/blaze";
import EditorCameraControls from "blaze-2d/lib/src/dropins/camera/editorControls";
import Entity from "blaze-2d/lib/src/entity";
import { Mouse } from "blaze-2d/lib/src/input/mouse";
import RectCollider from "blaze-2d/lib/src/physics/collider/rect";
import Scene from "blaze-2d/lib/src/scene";
import Rect from "blaze-2d/lib/src/shapes/rect";
import World from "blaze-2d/lib/src/world";
import { vec2 } from "gl-matrix";
import Game from "./game";
import Player from "./player";
import Tile from "./tile";

export default class MapEditor {
  canvas = Blaze.getCanvas();
  scene = new Scene();
  world = this.scene.world;
  physics = this.scene.physics;
  camera = this.world.getCamera();

  editorControls = new EditorCameraControls(this.camera, this.canvas.element);
  ghostTile: Entity;
  tileType = "borderMiddle";

  tiles: Tile[] = [];

  constructor() {
    this.camera.minZoom = 0.5;
    this.camera.maxZoom = 2;
    this.editorControls.negRotateKey = "";
    this.editorControls.posRotateKey = "";

    Blaze.setScene(this.scene);
    Game.setupScene();

    this.ghostTile = new Tile(vec2.create(), 0, TEXTURES[this.tileType]);
    this.ghostTile.setZIndex(1);
    this.world.addEntity(this.ghostTile);

    this.canvas.keys.addListener("KeyR", this.ghostTileRotate);
    this.canvas.mouse.addListener(Mouse.MOVE, this.ghostTileMove);
    this.canvas.mouse.addListener(Mouse.MOVE, this.tilePlace);
    this.canvas.mouse.addListener(Mouse.LEFT, this.tilePlace);
    this.canvas.mouse.addListener(Mouse.RIGHT, this.tileRemove);
    this.canvas.mouse.addListener(Mouse.MOVE, this.tileRemove);

    this.canvas.element.focus();

    // const player = new Player("blue", true);
  }

  ghostTileRotate = (pressed: boolean) => {
    if (pressed) {
      this.ghostTile.rotate(TILE_ROTATION_INC);
    }
  };

  ghostTileMove = (pressed: boolean, pos: vec2) => {
    const world = this.world.getWorldFromPixel(pos);
    const tile = Game.worldToTilePos(world);

    this.ghostTile.setPosition(tile);
  };

  tilePlace = (pressed: boolean) => {
    if (!pressed) return;

    const prev = this.findTileAt(this.ghostTile.getPosition());
    if (prev) {
      this.removeTile(prev);
    }

    const tile = new Tile(
      this.ghostTile.getPosition(),
      this.ghostTile.getRotation(),
      TEXTURES[this.tileType]
    );
    this.world.addEntity(tile);

    this.tiles.push(tile);
  };

  tileRemove = (pressed: boolean, pos: vec2, e: MouseEvent) => {
    const tile = this.findTileAt(this.ghostTile.getPosition());
    if (!this.canvas.mouse.isPressed(Mouse.RIGHT) || !tile) return;

    this.removeTile(tile);
    e.preventDefault();
  };

  removeTile(tile: Tile) {
    this.world.removeEntity(tile);
    const i = this.tiles.findIndex((t) => t === tile);
    if (i === -1) return;

    this.tiles.splice(i, 1);
  }

  findTileAt(pos: vec2) {
    const tilePos = Game.worldToTilePos(pos);

    for (const tile of this.tiles) {
      if (vec2.equals(tile.getPosition(), tilePos)) {
        return tile;
      }
    }
  }

  setTileType(type: string) {
    const tex = TEXTURES[type];
    if (!tex) return;

    this.tileType = type;
    this.ghostTile.getPieces()[0].texture = tex;
  }
}
