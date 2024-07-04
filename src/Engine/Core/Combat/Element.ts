import {StringHelper} from "../../../Utility/StringHelper.ts";

export class Element {
    public static none = new Element('none', '-');

    constructor(
        public readonly name: string,
        public readonly abbreviation: string,
    ) {
    }

    public toString(): string {
        return StringHelper.capitalize(this.name);
    }
}