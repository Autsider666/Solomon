import {Random} from "../../../Utility/Random.ts";
import {MaxStat, Stat, StatList, Stats} from "../Stat/Stat.ts";
import {RacialStats} from "./RacialStats.ts";

export class Race {
    constructor(
        public readonly name: string,
        public readonly description: string,
        public readonly baseStats: StatList,
    ) {
    }

    generateStats(): RacialStats {
        const generatedModifiers: StatList = new Map<Stat, number>();

        for (const stat of Stats) {
            const base = this.baseStats.get(stat);
            if (base === undefined) {
                throw new Error('Missing stat. Should probably switch to something else');
            }

            let value = base;

            value += Random.range(4);
            while (value < MaxStat[stat] && Random.percent((base * 2) + 30)) {
                value++;
            }
        }

        return new RacialStats(
            this,
            generatedModifiers,
            // Random.range(100000),
        );
    }
}