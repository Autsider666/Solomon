import {ActionResult} from "./ActionResult.ts";

export interface Action {
    perform(): ActionResult;
}