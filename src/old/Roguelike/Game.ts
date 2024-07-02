import {Color, DefaultLoader, Engine, EngineOptions} from "excalibur";
import {MapScene} from "./Excalibur/Scene/MapScene.ts";
import {AssetLoaderInterface} from "./Utility/Asset/AssetLoader/AssetLoaderInterface.ts";
import {FloorAssetLoader} from "./Utility/Asset/AssetLoader/DawnLike/FloorAssetLoader.ts";
import {WallAssetLoader} from "./Utility/Asset/AssetLoader/DawnLike/WallAssetLoader.ts";
import {AssetType} from "./Utility/Asset/types.ts";

type GameProps = {
    seed?: number,
    engineOptions?: EngineOptions,
}

export class Game {
    private readonly seed: number;
    private readonly engine: Engine;
    private readonly assetLoaders: Map<AssetType, AssetLoaderInterface>;

    constructor({
                    seed = Date.now(),
                    engineOptions
                }: GameProps = {}) {
        this.seed = seed;

        this.engine = new Engine({
            backgroundColor: Color.Black,
            ...engineOptions
        });

        this.assetLoaders = new Map<AssetType, AssetLoaderInterface>();
        this.assetLoaders.set(AssetType.Floor, new FloorAssetLoader());
        this.assetLoaders.set(AssetType.Wall, new WallAssetLoader());

        this.engine.addScene('map', new MapScene(
            {height: 100, width: 100},
        ));
    }

    async start(): Promise<void> {
        const loader = new DefaultLoader();

        // for (const assetLoader of this.assetLoaders.values()) {
        //     assetLoader.load(loader);
        // }

        await this.engine.start(loader);
        this.engine.goToScene('map');
    }

    public getSeed(): number {
        return this.seed;
    }

    public getAssetLoader(type: AssetType): AssetLoaderInterface {
        const loader = this.assetLoaders.get(type);
        if (!loader) {
            throw new Error('No loader available for asset type ' + type);
        }

        return loader;
    }
}