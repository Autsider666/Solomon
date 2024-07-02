type DirectionRange = -1 | 0 | 1;

export class Direction {
    constructor(
        public readonly dX: DirectionRange,
        public readonly dY: DirectionRange,
    ) {
        if (Math.abs(dX) + Math.abs(dY) > 1) {
            throw new Error('Invalid direction');
        }
    }

    reverse(): Direction {
        return new Direction(-this.dX as DirectionRange, -this.dY as DirectionRange);
    }
}