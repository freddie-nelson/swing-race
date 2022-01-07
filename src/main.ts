import Blaze from "blaze-2d/lib/src/blaze";
import BlazeElement from "blaze-2d/lib/src/ui/element";
import Color from "blaze-2d/lib/src/utils/color";
import TextureAtlas from "blaze-2d/lib/src/texture/atlas";
import Texture from "blaze-2d/lib/src/texture/texture";
import World from "blaze-2d/lib/src/world";
import Physics from "blaze-2d/lib/src/physics/physics";
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

globalThis.BALL_SIZE = 0.5;
globalThis.BALL_MASS = 1;

WORLD.cellSize = vec2.fromValues(32, 32);

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

  const border = new Texture(new Color("#929292"));

  Object.keys(balls).forEach((k) => {
    TEXTURES[`${k}Ball`] = balls[k];
  });

  Object.keys(anchors).forEach((k) => {
    TEXTURES[`${k}Anchor`] = anchors[k];
  });

  TEXTURES.border = border;

  await Promise.all([
    border.loadImage("assets/border.png"),
    ...Object.keys(balls).map((k) => balls[k].loadImage(`assets/${k}-ball.png`)),
    ...Object.keys(anchors).map((k) => anchors[k].loadImage(`assets/${k}-anchor.png`)),
  ]);

  await ATLAS.addTextures(border, ...Object.values(balls), ...Object.values(anchors));
})();

const player = new Player();
