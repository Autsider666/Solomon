import {Stat, StatList} from "../Stat/Stat.ts";
import {Race} from "./Race.ts";

export class RacialStats {
    constructor(
        private readonly race: Race,
        private readonly maxStats: StatList,
        // private readonly seed: number,
    ) {
    }

    get name(): string {
        return this.race.name;
    }

    getMaxStat(stat: Stat): number {
        return this.maxStats[stat];
    }

    getValueAtLevel(stat: Stat, level: number): number {
        console.log(stat, level, 'TODO'); //TODO
        return 0;
    }
}