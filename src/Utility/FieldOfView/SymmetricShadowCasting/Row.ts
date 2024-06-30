import Fraction from "fraction.js";
import {Tile} from "./Tile.ts";
import {roundTiesDown, roundTiesUp} from "./Utility.ts";

export class Row {
    constructor(
        public depth: number,
        public startSlope: Fraction,
        public endSlope: Fraction,
    ) {
    }

    public* getTiles(): Generator<Tile> {
        const minColumn = roundTiesUp(this.startSlope.mul(this.depth).valueOf());
        const maxColumn = roundTiesDown(this.endSlope.mul(this.depth).valueOf());

        for (let column = minColumn; column <= maxColumn + 1; column++) {
            yield [this.depth, column];
        }
    }

    next(): Row {
        return new Row(
            this.depth + 1,
            this.startSlope,
            this.endSlope,
        );
    }
}