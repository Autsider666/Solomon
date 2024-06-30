import {Coordinate} from "../../Type/Dimensional.ts";
import {Tile} from "./Tile.ts";

export enum CardinalDirection {
    North = 'North',
    South = 'South',
    East = 'East',
    West = 'West',
}

export class Quadrant {
    constructor(
        private readonly direction: CardinalDirection,
        private readonly origin: Readonly<Coordinate>,
    ) {
    }

    transform([row, column]: Tile): Coordinate {
        if (this.direction === CardinalDirection.North) {
            return {x: this.origin.x + column, y: this.origin.y - row};
        }

        if (this.direction === CardinalDirection.South) {
            return {x: this.origin.x + column, y: this.origin.y + row};
        }

        if (this.direction === CardinalDirection.East) {
            return {x: this.origin.x + row, y: this.origin.y + column};
        }

        if (this.direction === CardinalDirection.West) {
            return {x: this.origin.x - row, y: this.origin.y + column};
        }

        throw new Error('Invalid direction');
    }
}