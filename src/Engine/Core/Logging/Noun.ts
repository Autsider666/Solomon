import {Pronoun} from "./Pronoun.ts";

export class Noun {
    constructor(
        public readonly name: string,
    ) {
    }

    get pronoun(): Pronoun {
        return Pronoun.it;
    }

    public toString(): string {
        return this.name;
    }
}