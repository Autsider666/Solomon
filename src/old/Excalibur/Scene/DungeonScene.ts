import {DefaultLoader, Graphic, Random, Scene, Vector} from "excalibur";
import {Player} from "../Actor/Player.ts";
import {AssetLoader} from "../../Roguelike/Utility/Asset/AssetLoader/AssetLoader.ts";
import {FloorAssetLoader} from "../../Roguelike/Utility/Asset/AssetLoader/DawnLike/FloorAssetLoader.ts";
import {WallAssetLoader} from "../../Roguelike/Utility/Asset/AssetLoader/DawnLike/WallAssetLoader.ts";
import {FieldOfViewSystem} from "../ECS/System/FieldOfViewSystem.ts";
import {LightingSystem} from "../ECS/System/LightingSystem.ts";
import {MovementSystem} from "../ECS/System/MovementSystem.ts";
import {PlayerInputSystem} from "../ECS/System/PlayerInputSystem.ts";
import {GridLayer} from "../types.ts";
import {TileGrid} from "../Utility/Tile/TileGrid.ts";

type DungeonSceneProps = {
    height: number,
    width: number,
};

export class DungeonScene extends Scene {
    private readonly tileSize: number = 16;

    private readonly walls: AssetLoader;
    private readonly floors: AssetLoader;

    private readonly random: Random = new Random();

    private readonly grid: TileGrid<GridLayer>;
    private readonly height: number;
    private readonly width: number;

    private readonly player: Player;

    constructor({height, width}: DungeonSceneProps) {
        super();

        this.height = height;
        this.width = width;

        this.grid = new TileGrid<GridLayer>(
            this,
            this.tileSize,
            height,
            width,
        );

        this.player = new Player(this.tileSize);

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

    onInitialize() {
        this.world.add(new MovementSystem(this.world, this.tileSize, this.grid));
        this.world.add(new FieldOfViewSystem(this.world, this.grid));
        this.world.add(new PlayerInputSystem(this.world));
        this.world.add(new LightingSystem(this.world, this.grid));

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



            // sprite.tint = Color.fromHex(ColorHelper.shadeBlend(1, ColorHelper.White));
            // sprite.tint = Color.fromHex(ColorHelper.shadeBlend(0, ColorHelper.Black));

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

        // this.grid.createLayer('creatures', 0, tile => {
        //     if (!this.random.bool(10 / (this.width * this.height))) {
        //         return;
        //     }
        //
        //     tile.solid = true;
        //
        //     const graphic = new Rectangle({
        //         height: this.tileSize,
        //         width: this.tileSize,
        //         color: Color.White,
        //     });
        //     tile.addGraphic(graphic);
        // });

        this.player.setTilePos(this.grid.getRandomFreeTile());
    }
}