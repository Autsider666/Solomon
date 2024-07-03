import {Coordinate} from "../../Utility/Geometry/Shape/Coordinate.ts";
import {Actor} from "../Core/Actor.ts";
import {Game} from "../Core/Game.ts";
import {Pronoun} from "../Core/Logging/Pronoun.ts";
import {Monster} from "../Monster/Monster.ts";
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

    get vitality(): Vitality {
        return this.save.vitality;
    }

    seeMonster(monster: Monster): void {
        //TODO status effects like blindness?

        console.log('seen', monster);

        throw new Error('Not yet implemented'); //Fixme
    }
}