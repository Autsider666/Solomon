import {StringHelper} from "../../../Utility/StringHelper.ts";
import {Noun} from "../Logging/Noun.ts";
import {ItemType} from "./ItemType.ts";

export class Item extends Noun {
    constructor(
        public readonly type: ItemType,
        private amount: number,
    ) {
        super('item');
    }

    get count(): number {
        return this.amount;
    }

    public toString(): string {
        return StringHelper.quantify(this.type.quantifiableName, this.count);
    }
}