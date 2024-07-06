import {Random as EXRandom} from 'excalibur';
import {Coordinate} from "./Geometry/Shape/Coordinate.ts";
import {Rectangle} from "./Geometry/Shape/Rectangle.ts";

export class Random {
    private static random: EXRandom = new EXRandom();

    public static range(min: number, max?: number): number {
        if (max === undefined) {
            max = min;
            min = 0;
        }

        return this.random.integer(min, max);
    }

    public static percent(chance: number): boolean {
        return this.range(100) < chance;
    }

    public static float(min: number, max?: number) {
        if (max === undefined) {
            max = min;
            min = 0;
        }

        return this.random.floating(min, max);
    }

    public static coordinateInRectangle(rectangle: Rectangle): Coordinate {
        return new Coordinate(
            this.range(rectangle.x, rectangle.x + rectangle.width - 1),
            this.range(rectangle.y, rectangle.y + rectangle.height - 1),
        );
    }

    public static shuffle<T>(array: Array<T>): Array<T> {
        const tempArray = array.slice(0);
        let swap: T;
        for (let i = 0; i < tempArray.length - 2; i++) {
            const randomIndex = this.range(i, tempArray.length - 1);
            swap = tempArray[i];
            tempArray[i] = tempArray[randomIndex];
            tempArray[randomIndex] = swap;
        }

        return tempArray;
    }
}