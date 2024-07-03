import {Coordinate} from "../../Utility/Geometry/Shape/Coordinate.ts";
import {Actor} from "../Core/Actor.ts";
import {Action} from "./Action.ts";

export abstract class ActorAction extends Action {
    private _actor!: Actor;
    private _position!: Coordinate;

    get actor(): Actor {
        return this._actor;
    }

    bindActor(actor: Actor) {
        this._actor = actor;
        this._position = actor.position;
        this.bindGame(actor.game);
    }

    protected override log(message: string): void {
        if (this.game.stage.getTileAt(this._position).isVisible) {
            super.log(message);
        }
    }
}