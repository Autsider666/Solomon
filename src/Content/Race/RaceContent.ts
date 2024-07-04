import {Race} from "../../Engine/Character/Race/Race.ts";
import {ResourceSet} from "../../Engine/Core/Resource/ResourceSet.ts";

export class RaceContent {
    private static content: ResourceSet<Race> = new ResourceSet();

    static add(content: Race, tags?: string[]): void {
        this.content.add(content, content.name, 0, 0, 0, 0, tags && tags.length ? tags.join(" ") : undefined);
    }

    static get(name: string): Race {
        return this.content.get(name);
    }
}