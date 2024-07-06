export class Energy {
    public static readonly minSpeed: number = 0;
    public static readonly normalSpeed: number = 6;
    public static readonly maxSpeed: number = 12;

    public static readonly actionCost: number = 240;

    private static readonly gains: number[] = [
        15, // 1/4 normal speed
        20, // 1/3 normal speed
        24, // 2/5 normal speed
        30, // 1/2 normal speed
        40, // 2/3 normal speed
        50, // 5/6 normal speed
        60, // normal speed
        80, // 4/3 normal speed
        100, // 5/3 normal speed
        120, // 2x normal speed
        150, // 3/2 normal speed
        180, // 3x normal speed
        240 // 4x normal speed
    ];

    private energy: number = 0;

    get canTakeTurn(): boolean {
        return this.energy >= Energy.actionCost;
    }

    public gain(speed: number): boolean {
        this.energy += Energy.gains[speed];

        return this.canTakeTurn;
    }

    public spend(): void {
        if (!this.canTakeTurn) {
            throw new Error('Can\'t spend energy.');
        }

        this.energy -= Energy.actionCost;
    }
}