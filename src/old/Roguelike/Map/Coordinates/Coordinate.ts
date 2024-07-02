import {Direction} from "./Direction.ts";

export class Coordinate {
    private _x: number;
    private _y: number;

    constructor(
        x: number,
        y: number,
    ) {
        this._x = x;
        this._y = y;
    }

    get x(): number {
        return this._x;
    }

    get y(): number {
        return this._y;
    }

    add(modifier: Direction | Coordinate, newCoordinate: boolean = false): Coordinate {
        let x: number = this.x;
        let y: number = this.y;

        if (modifier instanceof Direction) {
            x += modifier.dX;
            y += modifier.dY;
        } else {
            x += modifier.x;
            y += modifier.y;
        }

        if (newCoordinate) {
            return new Coordinate(x, y);
        }

        this._x = x;
        this._y = y;

        return this;
    }
}