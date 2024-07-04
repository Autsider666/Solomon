import {ResourceSet} from "../../Engine/Core/Resource/ResourceSet.ts";
import {Breed} from "../../Engine/Monster/Breed.ts";

export class MonsterContent {
    private static breeds: ResourceSet<Breed> = new ResourceSet();

    static add(breed: Breed, frequency: number, tags?: string[]): void {
        this.breeds.add(breed, breed.name, breed.depth, breed.depth, frequency, frequency, tags && tags.length ? tags.join(" ") : undefined);
    }

    static get(name: string): Breed {
        return this.breeds.get(name);
    }
}