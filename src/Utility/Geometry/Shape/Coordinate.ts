import {Shape} from "./Shape.ts";

export class Coordinate extends Shape {
    static zero = new Coordinate(0, 0);

    private static readonly reusableCoordinate:Coordinate = this.zero;

    constructor(
        public x: number,
        public y: number,
    ) {
        super();
    }

    public static create(x:number, y:number, newInstance:boolean = false):Coordinate {
        if (newInstance) {
            return new Coordinate(x,y);
        }

        this.reusableCoordinate.x = x;
        this.reusableCoordinate.y = y;

        return this.reusableCoordinate;
    }
}