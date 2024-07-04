import {Random} from "../../../Utility/Random.ts";
import {Resource} from "./Resource.ts";

export type ResourceQueryKey = string;

export class ResourceQuery<T> {
    constructor(
        public readonly depth: number,
        private readonly resources: ReadonlyArray<Resource<T>>,
        private readonly chances: ReadonlyArray<number>,
        private readonly totalChance: number,
    ) {
    }

    choose(): T | undefined {
        if (this.resources.length === 0) {
            return undefined;
        }

        const randomChance = Random.float(this.totalChance);

        let first: number = 0;
        let last: number = this.resources.length - 1;

        // eslint-disable-next-line no-constant-condition
        while (true) {
            const middle: number = (first + last) / 2;
            if (middle > 0 && randomChance < this.chances[middle - 1]) {
                last = middle - 1;
            } else if (randomChance < this.chances[middle]) {
                return this.resources[middle].object;
            } else {
                first = middle + 1;
            }
        }
    }

    dump(): void {
        for (let i = 0; i < this.resources.length; i++) {
            let chance: number = this.chances[i];
            if (i > 0) {
                chance -= this.chances[i - 1];
            }

            const percent: string = (100.0 * chance / this.totalChance).toString(5);
            console.log(`${percent}% ${this.resources[i].object}`);
        }
    }

    static generateKey(name: string, depth: number): ResourceQueryKey {
        return `${name} (${depth})`;
    }
}