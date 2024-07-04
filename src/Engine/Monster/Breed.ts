import {Coordinate} from "../../Utility/Geometry/Shape/Coordinate.ts";
import {Attack} from "../Core/Combat/Attack.ts";
import {Game} from "../Core/Game.ts";
import {Monster} from "./Monster.ts";

export class Breed {
    constructor(
        public readonly name: string,
        public readonly maxHealth: number,
        public readonly attacks: ReadonlyArray<Attack>,
        public readonly depth: number,
    ) {
    }

    spawn(game: Game, position: Coordinate): Monster {
        return new Monster(game, this, position);
    }
}