import {Direction} from "../../Utility/Geometry/Direction.ts";
import {Character} from "../Character/Character.ts";
import {Action} from "./Action.ts";
import {ActionResult} from "./ActionResult.ts";
import {RestAction} from "./RestAction.ts";

export class MoveAction extends Action {
    constructor(public readonly direction: Direction) {
        super();
    }

    override onPerform(): ActionResult {
        if (this.direction === Direction.none) {
            return this.alternative(new RestAction());
        }

        const targetPosition = this.actor.position.inDirection(this.direction);
        const target = this.game.stage.getActorAt(targetPosition);
        if (target) {
            if (target === this.actor) {
                throw new Error('Why would target ever be same as actor?');
            }

            return this.succeed('TODO handle attack when moving into monster?'); //TODO
        }

        if (!this.actor.canOccupy(targetPosition)) {
            if (this.actor instanceof Character) {
                this.game.stage.exploreAt(targetPosition, true);
            }

            return this.fail('Hit something in the dark');
        }

        this.game.stage.moveActor(this.actor.position, targetPosition);

        //TODO pickup stuff on ground

        return this.succeed();
    }

}