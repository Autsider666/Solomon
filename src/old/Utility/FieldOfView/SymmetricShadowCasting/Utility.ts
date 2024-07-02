import Fraction from "fraction.js";
import {Row} from "./Row.ts";
import {Tile} from "./Tile.ts";

export function getSlope([depth, column]: Tile): Fraction {
    return new Fraction(2 * column - 1, 2 * depth);
}

export function isSymmetric(row: Row, [, column]: Tile): boolean {
    return column >= row.startSlope.mul(row.depth).valueOf() && column <= row.endSlope.mul(row.depth).valueOf();
}

export function roundTiesUp(value: number): number {
    return Math.floor(value + 0.5);
}

export function roundTiesDown(value: number): number {
    return Math.floor(value - 0.5);
}