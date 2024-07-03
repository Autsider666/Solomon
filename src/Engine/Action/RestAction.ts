import {Character} from "../Character/Character.ts";
import {ActionResult} from "./ActionResult.ts";
import {ActorAction} from "./ActorAction.ts";

export class RestAction extends ActorAction {
    onPerform(): ActionResult {
        if (this.actor instanceof Character) {
            this.actor.health++;
        } else if (!this.actor.isVisible) {
            this.actor.health++;
        }

        return this.succeed();
    }

}