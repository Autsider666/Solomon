import {Vector} from "excalibur";
import Easing from "../../../Utility/Math/Easing.ts";
import {BaseComponent} from "./BaseComponent.ts";

export class LightSourceComponent extends BaseComponent {
    public readonly potentialTiles: Map<Vector, number> = new Map<Vector, number>();

    constructor(
        private readonly maxDistance: number,
    ) {
        super();

        for (let x = -this.maxDistance; x < this.maxDistance; x++) {
            for (let y = -this.maxDistance; y < this.maxDistance; y++) {
                const pos = new Vector(x, y);
                const distance = Vector.Zero.distance(pos);
                const localStrength = distance > this.maxDistance ? 1 : Easing.easeInOutSine(distance / this.maxDistance);
                if (localStrength < 1) {
                    this.potentialTiles.set(pos, localStrength);
                }
            }
        }
    }
}