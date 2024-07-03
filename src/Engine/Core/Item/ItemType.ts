import {StringHelper} from "../../../Utility/StringHelper.ts";

export class ItemType {
    constructor(
        public readonly quantifiableName: string,
    ) {

    }

    get name(): string {
        return StringHelper.singular(this.quantifiableName);
    }

}