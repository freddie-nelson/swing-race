import Blaze from "@blz/blaze";
import BlazeElement from "@blz/ui/element";
import Color from "@blz/utils/color";
import TextureAtlas from "@blz/texture/atlas";
import Texture from "@blz/texture/texture";
import World from "@blz/world";
import Physics from "@blz/physics/physics";
import BatchRenderer from "@blz/renderer/batchRenderer";
import EditorControls from "@blz/dropins/camera/editorControls";
import { vec2 } from "gl-matrix";
import Player from "./player";
import Scene from "blaze-2d/lib/src/scene";
import MapEditor from "./mapEditor";
import GameMap from "./map";

// setup globals
declare global {
  var CANVAS: BlazeElement<HTMLCanvasElement>;
  var ATLAS: TextureAtlas;
  var TEXTURES: { [index: string]: Texture };

  var SMALL_TEXS: boolean;
  var CELL_SCALE: number;

  var BALL_RADIUS: number;
  var BALL_MASS: number;

  var TILE_TYPES: string[];
  var TILE_IMAGES: string[];

  var TILE_SIZE: number;
  var TILE_SLOP: number;
  var TILE_MASS: number;
  var TILE_ROTATION_INC: number;
}

export default abstract class Game {
  static canvas: BlazeElement<HTMLCanvasElement>;
  static cleanup: () => void;

  static controls = {
    rollRight: "KeyD",
    rollLeft: "KeyA",
    jump: "Space",
  };

  static init() {
    // setup blaze
    Blaze.init(<HTMLCanvasElement>document.querySelector("canvas"));
    Blaze.setBgColor(new Color("#202020"));
    Blaze.start();

    globalThis.CANVAS = Blaze.getCanvas();
    globalThis.ATLAS = new TextureAtlas(4096);
    globalThis.TEXTURES = {};

    globalThis.SMALL_TEXS = true;
    globalThis.CELL_SCALE = 2;

    globalThis.BALL_RADIUS = 0.25;
    globalThis.BALL_MASS = 1;

    globalThis.TILE_TYPES = [
      "borderMiddle",
      "borderCorner",
      "borderCornerInner",
      "logMiddle",
      "logCorner",
      "logCornerMirror",
      "logJunction",
      "logCross",
      "logEnd",
    ];
    globalThis.TILE_IMAGES = [
      "border-middle",
      "border-corner",
      "border-corner-inner",
      "log-middle",
      "log-corner",
      "log-corner-mirror",
      "log-junction",
      "log-cross",
      "log-end",
    ];

    globalThis.TILE_SIZE = 1;
    globalThis.TILE_SLOP = 0.01;
    globalThis.TILE_MASS = 0;
    globalThis.TILE_ROTATION_INC = -Math.PI / 4;

    this.canvas = Blaze.getCanvas();

    this.setup();
  }

  static setup() {
    BatchRenderer.atlas = ATLAS;

    // load textures
    (async () => {
      const balls: { [index: string]: Texture } = {
        blue: new Texture(new Color("#0061FF")),
        cyan: new Texture(new Color("#01FEEE")),
        green: new Texture(new Color("#54E001")),
        orange: new Texture(new Color("#FF8000")),
        pink: new Texture(new Color("#FE01A8")),
        purple: new Texture(new Color("#9B00FF")),
        red: new Texture(new Color("#FF0A00")),
        yellow: new Texture(new Color("#FEFE00")),
      };

      const anchors: { [index: string]: Texture } = {
        blue: new Texture(new Color("#0061FF")),
        cyan: new Texture(new Color("#01FEEE")),
        green: new Texture(new Color("#54E001")),
        orange: new Texture(new Color("#FF8000")),
        pink: new Texture(new Color("#FE01A8")),
        purple: new Texture(new Color("#9B00FF")),
        red: new Texture(new Color("#FF0A00")),
        yellow: new Texture(new Color("#FEFE00")),
      };

      const rods: { [index: string]: Texture } = {
        blue: new Texture(new Color("#0061FF")),
        cyan: new Texture(new Color("#01FEEE")),
        green: new Texture(new Color("#54E001")),
        orange: new Texture(new Color("#FF8000")),
        pink: new Texture(new Color("#FE01A8")),
        purple: new Texture(new Color("#9B00FF")),
        red: new Texture(new Color("#FF0A00")),
        yellow: new Texture(new Color("#FEFE00")),
      };

      const trailOpacity = "CC";
      const trails: { [index: string]: Texture } = {
        blue: new Texture(new Color("#0061FF" + trailOpacity)),
        cyan: new Texture(new Color("#01FEEE" + trailOpacity)),
        green: new Texture(new Color("#54E001" + trailOpacity)),
        orange: new Texture(new Color("#FF8000" + trailOpacity)),
        pink: new Texture(new Color("#FE01A8" + trailOpacity)),
        purple: new Texture(new Color("#9B00FF" + trailOpacity)),
        red: new Texture(new Color("#FF0A00" + trailOpacity)),
        yellow: new Texture(new Color("#FEFE00" + trailOpacity)),
      };

      const tileTexs = [
        new Texture(new Color("#929292")),
        new Texture(new Color("#929292")),
        new Texture(new Color("#929292")),
        new Texture(new Color("#663a31")),
        new Texture(new Color("#663a31")),
        new Texture(new Color("#663a31")),
        new Texture(new Color("#663a31")),
        new Texture(new Color("#663a31")),
        new Texture(new Color("#663a31")),
      ];

      TEXTURES.spawnMarker = new Texture(new Color("#DDDDDD"));
      TEXTURES.spawnMarkerSelected = new Texture(new Color("#f08710"));

      TEXTURES.jumpBarContainer = new Texture(new Color("#6b6a6b"));

      for (let i = 0; i < TILE_TYPES.length; i++) {
        TEXTURES[TILE_TYPES[i]] = tileTexs[i];
      }

      Object.keys(balls).forEach((k) => {
        TEXTURES[`${k}Ball`] = balls[k];
      });

      Object.keys(anchors).forEach((k) => {
        TEXTURES[`${k}Anchor`] = anchors[k];
      });

      Object.keys(rods).forEach((k) => {
        TEXTURES[`${k}Rod`] = rods[k];
      });

      Object.keys(trails).forEach((k) => {
        TEXTURES[`${k}Trail`] = trails[k];
      });

      await ATLAS.addTextures(
        TEXTURES.spawnMarker,
        TEXTURES.spawnMarkerSelected,
        TEXTURES.jumpBarContainer,
        ...tileTexs,
        ...Object.values(balls),
        ...Object.values(anchors),
        ...Object.values(rods),
        ...Object.values(trails)
      );

      const texSuffix = SMALL_TEXS ? "-small" : "";

      await Promise.all([
        TEXTURES.spawnMarker.loadImage("/assets/misc/spawn-marker.png"),
        TEXTURES.spawnMarkerSelected.loadImage("/assets/misc/spawn-marker-selected.png"),
        ...tileTexs.map((tex, i) => tex.loadImage(`/assets/tiles/${TILE_IMAGES[i]}.png`)),
        ...Object.keys(balls).map((k) => balls[k].loadImage(`/assets/balls/${k}-ball${texSuffix}.png`)),
        ...Object.keys(anchors).map((k) =>
          anchors[k].loadImage(`/assets/anchors/${k}-anchor${texSuffix}.png`)
        ),
      ]);

      ATLAS.refreshAtlas();
    })();
  }

  static setupScene() {
    const world = Blaze.getScene().world;
    const physics = Blaze.getScene().physics;

    world.cellSize = vec2.fromValues(32 * CELL_SCALE, 32 * CELL_SCALE);
    world.useBatchRenderer = true;
    physics.setGravity(vec2.fromValues(0, -12));
  }

  static loadMapEditor() {
    if (!this.canvas) return;
    this.unload();

    return new MapEditor();
  }

  static loadMap(map: GameMap, addPlayer = true) {
    if (!this.canvas) return;
    this.unload();

    const scene = new Scene();
    Blaze.setScene(scene);
    this.setupScene();

    if (addPlayer) {
      const player = new Player("blue", true, true);
      player.ball.setPosition(map.spawn);
    }

    scene.world.addEntities(...map.tiles);
    scene.physics.addBodies(...map.tiles);
  }

  static unload() {
    if (this.cleanup) this.cleanup();

    Blaze.setScene(new Scene());
  }

  static worldToTilePos(world: vec2, rot = 0) {
    const pos = vec2.clone(world);
    vec2.rotate(pos, pos, vec2.create(), -rot);

    pos[0] = Math.floor(pos[0]) + TILE_SIZE / 2;
    pos[1] = Math.floor(pos[1]) + TILE_SIZE / 2;

    vec2.rotate(pos, pos, vec2.create(), rot);

    return pos;
  }

  static hide() {
    // console.log("hide", !!this.canvas);
    if (this.canvas) this.canvas.element.style.display = "none";
  }

  static show() {
    // console.log("show", !!this.canvas);
    if (this.canvas) this.canvas.element.style.display = "block";
  }
}
