import {Direction} from "../../Utility/Geometry/Direction.ts";
import {ActionResult} from "./ActionResult.ts";
import {ActorAction} from "./ActorAction.ts";

export class MoveAction extends ActorAction {
    constructor(public readonly direction: Direction) {
        super();
    }

    override onPerform(): ActionResult {
        throw new Error("Method not implemented.");
    }

}