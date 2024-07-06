import {Coordinate} from "../../Utility/Geometry/Shape/Coordinate.ts";
import {NumberHelper} from "../../Utility/NumberHelper.ts";
import {Action} from "../Action/Action.ts";
import {Motility} from "../Stage/Motility.ts";
import {Energy} from "./Energy.ts";
import {Game} from "./Game.ts";
import {Noun} from "./Logging/Noun.ts";
import {Pronoun} from "./Logging/Pronoun.ts";

export abstract class Actor extends Noun {
    private _health: number = 0;
    protected _action: Action | undefined = undefined;

    public readonly energy: Energy = new Energy();

    private _position: Coordinate;

    protected constructor(
        name: string,
        public readonly game: Game,
        position: Coordinate,
    ) {
        super(name);

        this._position = position;
    }

    get position(): Coordinate {
        return this._position;
    }

    set position(coordinate: Coordinate) {
        this.game.stage.moveActor(this._position, coordinate);
        this._position = coordinate;
    }

    get pronoun(): Pronoun {
        return Pronoun.it;
    }

    abstract get baseSpeed(): number;

    get speed(): number {
        return this.baseSpeed; //TODO already separating this for future (de)buffs
    }

    get health(): number {
        return this._health;
    }

    set health(value: number) {
        this._health = NumberHelper.clamp(value, 0, this.maxHealth);
    }

    abstract get motility(): Motility;

    get isAlive(): boolean {
        return this.health > 0;
    }

    get needsInput(): boolean {
        return false;
    }

    abstract get maxHealth(): number;

    get isVisible(): boolean {
        return this.game.stage.getTileAt(this.position).isVisible;
    }

    getAction(): Action | undefined {
        this._action?.bind(this);
        const action = this._action;
        this._action = undefined;

        return action;
    }

    setNextAction(action: Action): void {
        this._action = action;
    }

    public finishTurn(action: Action): void {
        this.energy.spend();

        if (this.isAlive) {
            this.onFinishTurn(action);
        }
    }

    // @ts-expect-error optional function
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected onFinishTurn(action: Action): void {

    }

    canOccupy(position: Coordinate): boolean {
        const tile = this.game.stage.getTileAt(position);

        return tile.canEnter(this.motility);
    }
}