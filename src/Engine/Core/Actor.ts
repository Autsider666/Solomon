import {Coordinate} from "../../Utility/Geometry/Shape/Coordinate.ts";
import {NumberHelper} from "../../Utility/NumberHelper.ts";
import {Game} from "./Game.ts";
import {Noun} from "./Logging/Noun.ts";
import {Pronoun} from "./Logging/Pronoun.ts";

export abstract class Actor extends Noun {
    private _health: number = 0;

    protected constructor(
        name: string,
        public readonly game: Game,
        public readonly position: Coordinate,
    ) {
        super(name);
    }

    get pronoun(): Pronoun {
        return Pronoun.it;
    }

    get health(): number {
        return this._health;
    }

    set health(value: number) {
        this._health = NumberHelper.clamp(value, 0, this.maxHealth);
    }

    get isAlive(): boolean {
        return this.health > 0;
    }

    abstract get maxHealth(): number;

    get isVisible(): boolean {
        return this.game.stage.getTileAt(this.position).isVisible;
    }
}