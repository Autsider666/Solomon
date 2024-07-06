import {Coordinate} from "../../Utility/Geometry/Shape/Coordinate.ts";
import {Actor} from "../Core/Actor.ts";
import {Energy} from "../Core/Energy.ts";
import {Game} from "../Core/Game.ts";
import {Pronoun} from "../Core/Logging/Pronoun.ts";
import {Monster} from "../Monster/Monster.ts";
import {Motility} from "../Stage/Motility.ts";
import {CharacterSave} from "./CharacterSave.ts";
import {Vitality} from "./Stat/Vitality.ts";

export class Character extends Actor {
    constructor(
        game: Game,
        coordinate: Coordinate,
        private readonly save: CharacterSave,
    ) {
        super('you', game, coordinate);
    }

    get pronoun(): Pronoun {
        return Pronoun.you;
    }

    get maxHealth(): number {
        return this.vitality.maxHealth;
    }

    get needsInput(): boolean {
        return this._action === undefined;
    }

    get vitality(): Vitality {
        return this.save.vitality;
    }

    get race(): string {
        return this.save.race.name;
    }

    seeMonster(monster: Monster): void {
        //TODO status effects like blindness?

        console.log('seen', monster);

        throw new Error('Not yet implemented'); //Fixme
    }

    get baseSpeed(): number {
        return Energy.normalSpeed; //Fixme should be different for Character, right?
    }

    get motility(): Motility {
        return Motility.walk;
    }
}