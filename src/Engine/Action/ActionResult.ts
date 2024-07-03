import {Action} from "./Action.ts";

export class ActionResult {
    static success = new ActionResult(true, true);
    static failure = new ActionResult(false, true);
    static incomplete = new ActionResult(true, false);

    constructor(
        public readonly succeeded: boolean,
        public readonly done: boolean,
        public readonly alternative?: Action,
    ) {
    }

    static queueAlternative(alternative: Action): ActionResult {
        return new ActionResult(false, true, alternative);
    }
}