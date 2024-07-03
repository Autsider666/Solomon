import {Shape} from "./Shape.ts";

export class Coordinate extends Shape {
    static zero = new Coordinate(0, 0);

    constructor(
        public readonly x: number,
        public readonly y: number,
    ) {
        super();
    }
}