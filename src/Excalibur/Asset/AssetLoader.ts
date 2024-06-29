import {DefaultLoader, ImageSource, Sprite, SpriteSheet, SpriteSheetGridOptions, Vector} from "excalibur";
import {Coordinate} from "../../Utility/Type/Dimensional.ts";
import {TileMaskHandler, TileMaskMap} from "../Utilirty/Tile/TileMaskHandler.ts";

type AssetLoaderProps = {
    imagePath: string,
    spriteSheetOptions: Omit<SpriteSheetGridOptions, 'image'>,
    tileMask: TileMaskMap,
}

export class AssetLoader {
    private loaded: boolean = false;
    protected readonly image: ImageSource;
    protected readonly spriteSheet: SpriteSheet;
    protected readonly tileMaskHandler: TileMaskHandler;

    constructor({
                    imagePath,
                    spriteSheetOptions,
                    tileMask,
                }: AssetLoaderProps) {
        this.image = new ImageSource(imagePath);

        this.spriteSheet = SpriteSheet.fromImageSource({
            image: this.image,
            ...spriteSheetOptions,
        });

        this.tileMaskHandler = new TileMaskHandler(this.spriteSheet, tileMask);
    }

    load(loader: DefaultLoader): void {
        loader.addResource(this.image);
        this.loaded = true;
    }

    getSpriteByCoordinate({x, y}: Coordinate): Sprite {
        if (!this.loaded) {
            throw new Error('Can\'t get sprite before loading.');
        }

        return this.spriteSheet.getSprite(x, y);
    }

    getSpriteByMask(mask: number, offset?: Vector): Sprite | undefined {
        if (!this.loaded) {
            throw new Error('Can\'t get sprite before loading.');
        }

        return this.tileMaskHandler.getSprite(mask, offset);
    }
}