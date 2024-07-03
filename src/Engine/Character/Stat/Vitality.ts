import {BaseStat} from "./BaseStat.ts";
import {Stat} from "./Stat.ts";

export class Vitality extends BaseStat {
    get stat(): Stat {
        return Stat.Vitality;
    }

    get maxHealth(): number {
        return Math.floor(Math.pow(this.value, 1.4) + 1.23 * this.value + 18);
    }
}