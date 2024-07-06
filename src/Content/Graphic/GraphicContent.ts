import {Graphic} from "excalibur";
import {ResourceSet} from "../../Engine/Core/Resource/ResourceSet.ts";

export class GraphicContent {
    private static content: ResourceSet<Graphic> = new ResourceSet();

    static add(name: string, content: Graphic, tags?: string[]): void {
        this.content.add(content, name, 0, 0, 0, 0, tags && tags.length ? tags.join(" ") : undefined);
    }

    static has(name: string): boolean {
        return this.content.tryGet(name) !== undefined;
    }

    static get(name: string): Graphic {
        return this.content.get(name);
    }
}