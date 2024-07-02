import {MapLayer} from "../MapLayer.ts";
import {Coordinate} from "./Coordinate.ts";
import {Direction} from "./Direction.ts";

export class Position {
    constructor(
        private readonly coordinate: Coordinate,
        private readonly layer: MapLayer
    ) {
    }

    move(direction: Direction): boolean {
        this.coordinate.add(direction);

        const actor = this.layer.get(this.coordinate);
        if (!actor) {
            return false;
        }

        const target = this.layer.get(this.coordinate.add(direction));

        const reverseDirection = direction.reverse();
        if (target) {
            this.coordinate.add(reverseDirection);
            return false;
        }

        this.layer.set(this.coordinate.add(reverseDirection, true), null);
        this.layer.set(this.coordinate, actor);

        return true;
    }
}