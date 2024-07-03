import {Game} from "../Core/Game.ts";
import {ActionResult} from "./ActionResult.ts";

export abstract class Action {
    private _game!: Game;

    public perform(): ActionResult {
        return this.onPerform();
    }

    abstract onPerform(): ActionResult;

    get game(): Game {
        return this._game;
    }

    bindGame(game: Game): void {
        this._game = game;
    }

    protected log(message: string): void {
        this._game.log.message(message);
    }

    protected succeed(message?: string): ActionResult {
        if (message) {
            this.log(message);
        }

        return ActionResult.success;
    }
}