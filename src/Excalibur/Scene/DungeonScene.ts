import {
    Actor,
    Color,
    DefaultLoader,
    Engine,
    Graphic,
    Keys,
    Random,
    Raster,
    Rectangle,
    Scene,
    Vector
} from "excalibur";
import Easing from "../../Utility/Math/Easing.ts";
import {AssetLoader} from "../Asset/AssetLoader.ts";
import {FloorAssetLoader} from "../Asset/DawnLike/FloorAssetLoader.ts";
import {WallAssetLoader} from "../Asset/DawnLike/WallAssetLoader.ts";
import {TileGrid} from "../Utilirty/Tile/TileGrid.ts";

type DungeonSceneProps = {
    height: number,
    width: number,
};

export class DungeonScene extends Scene {
    private readonly tileSize: number = 16;

    private readonly walls: AssetLoader;
    private readonly floors: AssetLoader;

    private readonly random: Random = new Random();

    private readonly grid: TileGrid<'background' | 'creatures' | 'light'>;
    private readonly height: number;
    private readonly width: number;

    private readonly playerPos: Vector = new Vector(1, 1);
    private readonly player: Actor;
    private direction: 'up' | 'down' | 'left' | 'right' | undefined;

    private readonly lightMaxDistance: number = 10;

    constructor({height, width}: DungeonSceneProps) {
        super();

        this.height = height;
        this.width = width;

        this.grid = new TileGrid<'background' | 'creatures' | 'light'>(
            this,
            this.tileSize,
            height,
            width,
        );

        this.player = new Actor({
            width: this.tileSize,
            height: this.tileSize,
            color: Color.Red,
            anchor: Vector.Zero,
        });

        this.add(this.player);

        this.camera.strategy.lockToActor(this.player);
        this.camera.zoom = 1.5;

        this.walls = new WallAssetLoader(new Vector(0, 6));
        this.floors = new FloorAssetLoader(new Vector(0, 3));
    }

    onPreLoad(loader: DefaultLoader) {
        this.walls.load(loader);
        this.floors.load(loader);
    }

    onInitialize(engine: Engine) {
        this.grid.createLayer('background', -10, tile => {
            if (tile.x === 0 || tile.x === this.width - 1 || tile.y == 0 || tile.y === this.height - 1) {
                tile.solid = true;
                return;
            }

            tile.solid = this.random.bool(50 / (this.width * this.height));
        });

        this.grid.iterateLayer('background', tile => {
            let sprite: Graphic | undefined;
            const mask = this.grid.getTileMask('background', tile);
            if (tile.solid) {
                sprite = this.walls.getSpriteByMask(mask)?.clone();
            } else {
                sprite = this.floors.getSpriteByMask(mask)?.clone();
            }

            if (!sprite) {
                throw new Error('Hmmm, invalid tile mask.');
            }

            if (tile.solid) {
                switch (mask) {
                    // case 2:
                    //     sprite.rotation = Math.PI*0.5;
                    //     break;
                    case 4:
                        sprite.rotation = Math.PI;
                        break;
                    // case 8:
                    //     sprite.rotation = Math.PI*1.5;
                    //     break;
                }
            }

            tile.addGraphic(sprite);
        });

        engine.inputMapper.on(({keyboard}) => keyboard.isHeld(Keys.W), () => this.direction = 'up');
        engine.inputMapper.on(({keyboard}) => keyboard.isHeld(Keys.S), () => this.direction = 'down');
        engine.inputMapper.on(({keyboard}) => keyboard.isHeld(Keys.A), () => this.direction = 'left');
        engine.inputMapper.on(({keyboard}) => keyboard.isHeld(Keys.D), () => this.direction = 'right');

        this.grid.createLayer('light', 10, tile => {
            const graphic = new Rectangle({
                height: this.tileSize,
                width: this.tileSize,
                color: Color.fromRGB(0, 0, 0),
            });
            graphic.color.a = 0;
            tile.addGraphic(graphic);
        });

        this.grid.createLayer('creatures', 0, tile => {
            if (!this.random.bool(10 / (this.width * this.height))) {
                return;
            }

            tile.solid = true;

            const graphic = new Rectangle({
                height: this.tileSize,
                width: this.tileSize,
                color: Color.White,
            });
            tile.addGraphic(graphic);
        });
    }

    onActivate() {
        this.updateLight();
    }

    onPreUpdate() {
        if (this.updatePlayer()) {
            this.updateLight();
        }
    }

    private updatePlayer(): boolean {
        if (!this.direction) {
            return false;
        }

        // const currentTile = this.grid.getTile('creatures', this.playerPos);
        // if (!currentTile) {
        //     throw new Error('no tile?');
        // }

        switch (this.direction) {
            case "up":
                if (this.playerPos.y > 0) {
                    this.playerPos.y--;
                } else {
                    return false;
                }
                break;
            case "down":
                if (this.playerPos.y + 1 < this.height) {
                    this.playerPos.y++;
                } else {
                    return false;
                }
                break;
            case "left":
                if (this.playerPos.x > 0) {
                    this.playerPos.x--;
                } else {
                    return false;
                }
                break;
            case "right":
                if (this.playerPos.x + 1 < this.width) {
                    this.playerPos.x++;
                } else {
                    return false;
                }
                break;
        }

        const newTile = this.grid.getTile('creatures', this.playerPos);
        if (!newTile) {
            throw new Error('no tile?');
        }

        // currentTile.getGraphics().forEach(graphic => newTile.addGraphic(graphic));
        // currentTile.clearGraphics();

        this.player.pos.x = this.playerPos.x * this.tileSize;
        this.player.pos.y = this.playerPos.y * this.tileSize;

        this.direction = undefined;

        return true;
    }

    private updateLight(): void {
        this.grid.iterateLayer('light', tile => {
            const graphic = tile.getGraphics()[0];
            if (graphic instanceof Raster) {
                const distance = this.playerPos.distance(new Vector(tile.x, tile.y));
                graphic.color.a = distance > this.lightMaxDistance ? 1 : Easing.easeInOutSine(distance / this.lightMaxDistance);
            }
        });
    }
}