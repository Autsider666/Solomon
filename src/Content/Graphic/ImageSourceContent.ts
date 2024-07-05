import {DefaultLoader, ImageSource} from "excalibur";
import {ResourceSet} from "../../Engine/Core/Resource/ResourceSet.ts";

export class ImageSourceContent {
    private static content: ResourceSet<ImageSource> = new ResourceSet();
    private static loader: DefaultLoader | undefined = undefined;

    static add(name: string, path: string, tags?: string[]): void {
        if (this.loader === undefined) {
            throw new Error('Can\'t add new ImageSource before linking loader');
        }

        const source = new ImageSource(path);
        this.loader.addResource(source);

        this.content.add(source, name, 0, 0, 0, 0, tags && tags.length ? tags.join(" ") : undefined);
    }

    static get(name: string): ImageSource {
        return this.content.get(name);
    }

    static bindLoader(loader: DefaultLoader): void {
        this.loader = loader;
    }
}