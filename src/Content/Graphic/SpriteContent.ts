import {Sprite} from "excalibur";
import {ResourceSet} from "../../Engine/Core/Resource/ResourceSet.ts";

export class SpriteContent {
    private static content: ResourceSet<Sprite> = new ResourceSet();

    static add(name: string, content: Sprite, tags?: string[]): void {
        this.content.add(content, name, 0, 0, 0, 0, tags && tags.length ? tags.join(" ") : undefined);
    }

    static has(name: string): boolean {
        return this.content.tryGet(name) !== undefined;
    }

    static get(name: string): Sprite {
        return this.content.get(name);
    }
}