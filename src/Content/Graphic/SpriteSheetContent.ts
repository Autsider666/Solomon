import {Sprite, SpriteSheet, SpriteSheetGridOptions} from "excalibur";
import {ResourceSet} from "../../Engine/Core/Resource/ResourceSet.ts";
import {Coordinate} from "../../Utility/Geometry/Shape/Coordinate.ts";
import {ImageSourceContent} from "./ImageSourceContent.ts";

export class SpriteSheetContent {
    private static content: ResourceSet<SpriteSheet> = new ResourceSet();

    static add(name: string, imageSource: string, options: Omit<SpriteSheetGridOptions, 'image'>, tags?: string[]): void {
        const spriteSheet = SpriteSheet.fromImageSource({
            image: ImageSourceContent.get(imageSource),
            ...options,
        });

        this.content.add(spriteSheet, name, 0, 0, 0, 0, tags && tags.length ? tags.join(" ") : undefined);
    }

    static has(name: string): boolean {
        return this.content.tryGet(name) !== undefined;
    }

    static get(name: string): SpriteSheet {
        return this.content.get(name);
    }

    static getSprite(name: string, {x, y}: Coordinate): Sprite {
        return this.get(name).getSprite(x, y);
    }
}