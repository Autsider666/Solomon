import {Coordinate} from "../../Utility/Geometry/Shape/Coordinate.ts";
import {Actor} from "../Core/Actor.ts";
import {Game} from "../Core/Game.ts";
import {ActionResult} from "./ActionResult.ts";

export abstract class Action {

    private _game!: Game;
    private _consumesEnergy: boolean = true;
    private _actor!: Actor;
    private _position!: Coordinate;

    get actor(): Actor {
        return this._actor;
    }

    public perform(): ActionResult {
        return this.onPerform();
    }

    abstract onPerform(): ActionResult;

    get game(): Game {
        return this._game;
    }

    get consumesEnergy(): boolean {
        return this._consumesEnergy;
    }

    bind(actor: Actor, consumesEnergy: boolean = true): void {
        this._game = actor.game;
        this._consumesEnergy = consumesEnergy;
        this._actor = actor;
        this._position = actor.position;
    }

    protected log(message: string): void {
        if (this.game.stage.getTileAt(this._position).isVisible) {
            this._game.log.message(message);
        }
    }

    protected error(message: string): void {
        //TODO only when visible?
        this._game.log.error(message);
    }

    protected succeed(message?: string): ActionResult {
        if (message) {
            this.log(message);
        }

        return ActionResult.success;
    }

    protected fail(message?: string): ActionResult {
        if (message) {
            this.error(message);
        }

        return ActionResult.failure;
    }

    protected alternative(action: Action): ActionResult {
        action.bind(this._actor);
        return ActionResult.queueAlternative(action);
    }
}