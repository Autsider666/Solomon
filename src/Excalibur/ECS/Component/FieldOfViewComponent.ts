import {Vector} from "excalibur";
import {BaseComponent} from "./BaseComponent.ts";

export class FieldOfViewComponent extends BaseComponent {
    public readonly potentialTiles: Set<Vector> = new Set<Vector>();
    public readonly fieldOfView: Map<Vector, boolean> = new Map<Vector, boolean>();

    constructor(
        private readonly maxDistance: number,
    ) {
        super();

        for (let x = -this.maxDistance; x < this.maxDistance; x++) {
            for (let y = -this.maxDistance; y < this.maxDistance; y++) {
                const pos = new Vector(x, y);
                if (Vector.Zero.distance(pos) <= this.maxDistance) {
                    this.potentialTiles.add(pos);
                    this.fieldOfView.set(pos, true);
                }
            }
        }
    }

    // onAdd(owner: BaseActor) {
    //     owner.on<'lighting'>('lighting', ({grid}) => {
    //         const currentTile = grid.getTileByPoint('light',owner.pos);
    //         if (this.lastUpdatedPos.x === currentTile.x && this.lastUpdatedPos.y === currentTile.y) {
    //             return;
    //         }
    //
    //         for (const [gridPos, strength] of this.potentialTiles) {
    //             grid.getTile('light',gridPos)
    //         }
    //         this.lastUpdatedPos.setTo(currentTile.x, currentTile.y);
    //     });
    // }
}