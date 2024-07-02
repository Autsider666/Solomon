import {ImageSource} from "excalibur";
import {AssetProvider} from "./AssetProvider.ts";

export type ImageIdentifier = 'Wall' | 'Floor'

export const Images = new AssetProvider<ImageIdentifier, ImageSource>(
    ['Floor', 'Wall'],
    path => new ImageSource(path)
);
