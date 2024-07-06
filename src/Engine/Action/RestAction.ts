import {Character} from "../Character/Character.ts";
import {Action} from "./Action.ts";
import {ActionResult} from "./ActionResult.ts";

export class RestAction extends Action {
    onPerform(): ActionResult {
        if (this.actor instanceof Character) {
            this.actor.health++;
        } else if (!this.actor.isVisible) {
            this.actor.health++;
        }

        return this.succeed();
    }
}