import {Noun} from "../Logging/Noun.ts";
import {Element} from "./Element.ts";

export class Attack {
    constructor(
        public readonly noun: Noun|undefined,
        public readonly verb: string,
        public readonly damage: number,
        public readonly range:number = 0,
        public readonly element:Element = Element.none
    ) {
    }
}