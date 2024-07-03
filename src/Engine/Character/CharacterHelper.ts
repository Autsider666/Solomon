export class CharacterHelper {
    static maxLevel: number = 10 as const;

    static getLevelByExperience(experience: number): number {
        for (let level = 1; level <= this.maxLevel; level++) {
            if (experience < this.getExperienceCostForLevel(level)) {
                return level - 1;
            }
        }

        return this.maxLevel;
    }

    static getExperienceCostForLevel(level: number): number {
        if (level > this.maxLevel) {
            throw new Error('can\'t go above level ' + this.maxLevel);
        }

        return Math.round(Math.pow(level - 1, 3)) * 1000;
    }
}