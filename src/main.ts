import './style.css';
import {Color, DisplayMode, Engine, Keys, Random, Raster, Rectangle, Vector} from "excalibur";
import {TileGrid} from "./Excalibur/Utilirty/TileGrid.ts";
import Easing from "./Utility/Math/Easing.ts";

const gridHeight = 25;
const gridWidth = 25;
const tileSize: number = 16;

const engine = new Engine({
    maxFps: 30,
    width: gridWidth * tileSize,
    height: gridHeight * tileSize,
    displayMode: DisplayMode.FitScreen,
});
const grid = new TileGrid<'background' | 'creatures' | 'light'>(engine, tileSize, gridHeight, gridWidth);

const random = new Random();

const shift = random.integer(0, 20);

grid.createLayer('background', -10, tile => {
    const graphic = new Rectangle({
        height: tileSize,
        width: tileSize,
        color: Color.fromRGB(
            40 + random.integer(0, 15) + shift,
            40 + shift,
            40 + random.integer(0, 5) + shift,
        ),
    });
    tile.addGraphic(graphic);

    // const dT = tint - (2 * Math.pow(lightSource.distance(new Vector(tile.x,tile.y)),2));
    //
    // graphic.tint = Color.fromRGB(dT,dT,dT);
});

let direction: 'up' | 'down' | 'left' | 'right' | undefined;
const playerPos = new Vector(0, 0);

engine.inputMapper.on(({keyboard}) => keyboard.isHeld(Keys.W), () => direction = 'up');
engine.inputMapper.on(({keyboard}) => keyboard.isHeld(Keys.S), () => direction = 'down');
engine.inputMapper.on(({keyboard}) => keyboard.isHeld(Keys.A), () => direction = 'left');
engine.inputMapper.on(({keyboard}) => keyboard.isHeld(Keys.D), () => direction = 'right');

const updatePlayer = ():boolean => {
    if (!direction) {
        return false;
    }

    const currentTile = grid.getTile('creatures', playerPos);
    if (!currentTile) {
        throw new Error('no tile?');
    }

    switch (direction) {
        case "up":
            if (playerPos.y > 0) {
                playerPos.y--;
            } else {
                return false;
            }
            break;
        case "down":
            if (playerPos.y + 1 < gridHeight) {
                playerPos.y++;
            } else {
                return false;
            }
            break;
        case "left":
            if (playerPos.x > 0) {
                playerPos.x--;
            } else {
                return false;
            }
            break;
        case "right":
            if (playerPos.x + 1 < gridWidth) {
                playerPos.x++;
            } else {
                return false;
            }
            break;
    }

    const newTile = grid.getTile('creatures', playerPos);
    if (!newTile) {
        throw new Error('no tile?');
    }

    currentTile.getGraphics().forEach(graphic => newTile.addGraphic(graphic));
    currentTile.clearGraphics();

    direction = undefined;

    return true;
};

const lightMaxDistance = 10;
const updateLight = () => grid.iterateLayer('light', tile => {
    const graphic = tile.getGraphics()[0];
    if (graphic instanceof Raster) {
        const distance = playerPos.distance(new Vector(tile.x, tile.y));
        graphic.color.a = distance > lightMaxDistance ? 1 : Easing.easeInOutSine(distance / lightMaxDistance);
    }
});

engine.on('preupdate', () => {
    if (updatePlayer()) {
        updateLight();
    }
});

grid.createLayer('light', 10, tile => {
    const graphic = new Rectangle({
        height: tileSize,
        width: tileSize,
        color: Color.fromRGB(0, 0, 0),
    });
    graphic.color.a = 1;
    tile.addGraphic(graphic);
});

grid.createLayer('creatures', 0, tile => {
    if (tile.x === playerPos.x && tile.y === playerPos.y) {
        const graphic = new Rectangle({
            height: tileSize,
            width: tileSize,
            color: Color.Red,
        });
        tile.addGraphic(graphic);

        return;
    }

    if (!random.bool(10 / (gridWidth * gridHeight))) {
        return;
    }

    tile.solid = true;

    const graphic = new Rectangle({
        height: tileSize,
        width: tileSize,
        color: Color.White,
    });
    tile.addGraphic(graphic);
});

updateLight();

await engine.start();
