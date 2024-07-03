import {Shape} from "./Shape.ts";

export class Rectangle extends Shape {
    constructor(
        public readonly x:number,
        public readonly y:number,
        public readonly width:number,
        public readonly height:number,
    ) {
        super();
    }
}