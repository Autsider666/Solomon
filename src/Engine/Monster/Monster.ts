import {Coordinate} from "../../Utility/Geometry/Shape/Coordinate.ts";
import {Actor} from "../Core/Actor.ts";
import {Game} from "../Core/Game.ts";
import {Breed} from "./Breed.ts";

export class Monster extends Actor {
    constructor(
        game: Game,
        protected readonly breed: Breed,
        position: Coordinate,
    ) {
        super(breed.name, game, position);

        this.health = breed.maxHealth;
    }

    get maxHealth(): number {
        return this.breed.maxHealth;
    }
}