import Blaze from "@blz/blaze";
import BlazeElement from "@blz/ui/element";
import Color from "@blz/utils/color";
import TextureAtlas from "@blz/texture/atlas";
import Texture from "@blz/texture/texture";
import World from "@blz/world";
import Physics from "@blz/physics/physics";
import BatchRenderer from "@blz/renderer/batchRenderer";
import { vec2 } from "gl-matrix";
import Player from "./player";

// setup blaze
Blaze.init(<HTMLCanvasElement>document.querySelector("canvas"));
Blaze.setBgColor(new Color("#202020"));
Blaze.start();

// setup globals
declare global {
  var CANVAS: BlazeElement<HTMLCanvasElement>;
  var ATLAS: TextureAtlas;
  var TEXTURES: { [index: string]: Texture };
  var WORLD: World;
  var PHYSICS: Physics;

  var BALL_SIZE: number;
  var BALL_MASS: number;
}

globalThis.CANVAS = Blaze.getCanvas();
globalThis.ATLAS = new TextureAtlas(4096);
globalThis.TEXTURES = {};
globalThis.WORLD = Blaze.getScene().world;
globalThis.PHYSICS = Blaze.getScene().physics;

globalThis.BALL_SIZE = 0.6;
globalThis.BALL_MASS = 1;

WORLD.cellSize = vec2.fromValues(32, 32);
WORLD.useBatchRenderer = true;
BatchRenderer.atlas = ATLAS;

PHYSICS.setGravity(vec2.fromValues(0, -20));

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

  const border = new Texture(new Color("#929292"));

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

  TEXTURES.border = border;

  await ATLAS.addTextures(
    border,
    ...Object.values(balls),
    ...Object.values(anchors),
    ...Object.values(rods),
    ...Object.values(trails)
  );

  await Promise.all([
    border.loadImage("/assets/border.png"),
    ...Object.keys(balls).map((k) =>
      balls[k].loadImage(`/assets/${k}-ball.png`)
    ),
    ...Object.keys(anchors).map((k) =>
      anchors[k].loadImage(`/assets/${k}-anchor.png`)
    ),
  ]);

  ATLAS.refreshAtlas();
})();

const player = new Player("blue", true);
