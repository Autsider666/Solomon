import {Coordinate} from "../../Utility/Geometry/Shape/Coordinate.ts";
import {Actor} from "../Core/Actor.ts";
import {Energy} from "../Core/Energy.ts";
import {Game} from "../Core/Game.ts";
import {Motility} from "../Stage/Motility.ts";
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

    get baseSpeed(): number {
        return Energy.normalSpeed;
    }

    get motility(): Motility {
        return Motility.walk;
    }
}