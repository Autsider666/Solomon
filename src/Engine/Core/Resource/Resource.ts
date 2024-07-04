import {MathHelper} from "../MathHelper.ts";
import {ResourceTag} from "./ResourceTag.ts";

export class Resource<T> {
    public readonly tags: Set<ResourceTag<T>> = new Set<ResourceTag<T>>();

    constructor(
        public readonly object: T,
        private readonly startDepth: number,
        private readonly endDepth: number,
        private readonly startFrequency: number,
        private readonly endFrequency: number,
    ) {
    }

    getFrequencyAtDepth(depth: number): number {
        if (this.startDepth === this.endDepth) {
            return this.startFrequency;
        }

        return MathHelper.clampedLerp(depth, this.startDepth, this.endDepth, this.startFrequency, this.endFrequency);
    }

    getChanceAtDepth(depth: number): number {
        if (depth < this.startDepth) {
            const relativeDepth = this.startDepth - depth;
            const deviation = 0.6 + depth * 0.2;

            return Math.exp(-0.5 * Math.pow(relativeDepth, 2) / Math.pow(deviation, 2));
        } else if (depth > this.endDepth) {
            const relativeDepth = depth - this.endDepth;
            const deviation = 1.0 + depth * 0.1;

            return Math.exp(-0.5 * Math.pow(relativeDepth, 2) / Math.pow(deviation, 2));
        }

        return 1.0;
    }

    getTags(): Iterable<string> {
        return Array.from(this.tags).map(tag => tag.name);
    }

    public hasTag(tag: ResourceTag<T>): boolean {
        for (const resourceTag of this.tags) {
            if (resourceTag.contains(tag)) {
                return true;
            }
        }

        return false;
    }
}