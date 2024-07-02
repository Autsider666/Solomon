import {DefaultLoader, Graphic, Vector} from "excalibur";

export interface AssetLoaderInterface<Asset extends Graphic = Graphic> {
    load(loader: DefaultLoader): void;

    getSpriteByMask(mask: number, offset?: Vector): Asset | undefined;
}