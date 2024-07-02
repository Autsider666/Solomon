import {Loadable, Loader} from "excalibur";

export class AssetProvider<AssetIdentifier extends string, Asset extends Loadable<unknown>> {
    private readonly assets: Map<AssetIdentifier, Asset> = new Map<AssetIdentifier, Asset>();
    private readonly loadedAssets: Map<AssetIdentifier, boolean> = new Map<AssetIdentifier, boolean>();

    public readonly loader: Loader;

    constructor(
        expectedIdentifiers: AssetIdentifier[],
        private readonly assetBuilder: (path: string) => Asset,
    ) {
        for (const expectedIdentifier of expectedIdentifiers) {
            this.loadedAssets.set(expectedIdentifier, false);
        }

        this.loader = new Loader();
    }

    addResource(identifier: AssetIdentifier, path: string, override: boolean = false): void {
        if (!this.loadedAssets.has(identifier)) {
            throw new Error('Invalid asset identifier provided: ' + identifier);
        }

        if (this.assets.has(identifier) && !override) {
            throw new Error('Asset with identifier already exists: ' + identifier);
        }

        const asset = this.assetBuilder(path);
        this.assets.set(identifier, asset);

        this.loader.addResource(asset);

        this.loadedAssets.set(identifier, true);
    }

    get(identifier: AssetIdentifier): Asset {
        if (!this.loadedAssets.has(identifier)) {
            throw new Error('Invalid asset identifier provided: ' + identifier);
        }

        const asset = this.assets.get(identifier);
        if (asset) {
            return asset;
        }

        throw new Error('Missing asset: ' + identifier);
    }

    load(loader: Loader): void {
        const missing: AssetIdentifier[] = [];
        for (const [identifier, loaded] of this.loadedAssets) {
            if (!loaded) {
                missing.push(identifier);
            }
        }

        if (missing) {
            throw new Error('Missing assets: ' + missing.join(', '));
        }

        for (const asset of this.assets.values()) {
            loader.addResource(asset);
        }
    }
}