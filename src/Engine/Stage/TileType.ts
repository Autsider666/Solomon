import {Motility} from "./Motility.ts";

export class TileType {
    static uninitialized = new TileType('uninitialized', Motility.none);

    constructor(
        public readonly name: string,
        public readonly motility: Motility,
    ) {
    }

    get isTraversable(): boolean {
        return this.canEnter(Motility.doorAndWalk);
    }

    get isWalkable(): boolean {
        return this.canEnter(Motility.walk);
    }

    canEnter(motility: Motility): boolean {
        return (this.motility.bitmask & motility.bitmask) != 0;
    }
}