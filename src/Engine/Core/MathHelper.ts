export class MathHelper {
    static clampedLerp(value: number, min: number, max: number, outMin: number, outMax: number): number {
        if (min >= max) {
            throw new Error('Max should not be smaller or equal to min.');
        }

        if (value <= min) {
            return outMin;
        }

        if (value >= max) {
            return outMax;
        }

        const lerpValue = (value - min) / (max - min);

        return outMin + lerpValue * (outMax - outMin);
    }
}