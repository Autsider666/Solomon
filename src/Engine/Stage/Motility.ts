export class Motility {
    static none = new Motility(0);

    // TODO do these fit here or should they be configurable?
    static door = new Motility(1);
    static fly = new Motility(2);
    static swim = new Motility(4);
    static walk = new Motility(8);

    static doorAndFly = Motility.combine(this.door, this.fly);
    static doorAndWalk = Motility.combine(this.door, this.walk);
    static flyAndWalk = Motility.combine(this.fly, this.walk);
    static all = Motility.combine(this.door, this.fly, this.swim, this.walk);

    constructor(
        public readonly bitmask: number,
    ) {
    }

    static combine(...motilities: Motility[]): Motility {
        let combinedBitmask: number = 0;
        motilities.forEach(motility => combinedBitmask += motility.bitmask);

        return new Motility(combinedBitmask);
    }
}