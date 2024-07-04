import {Random as EXRandom} from 'excalibur';

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

    public static float(min: number, max?: number){
        if (max === undefined) {
            max = min;
            min = 0;
        }

        return this.random.floating(min, max);
    }
}