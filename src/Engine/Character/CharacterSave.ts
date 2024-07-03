import {CharacterHelper} from "./CharacterHelper.ts";
import {Race} from "./Race/Race.ts";
import {RacialStats} from "./Race/RacialStats.ts";
import {Vitality} from "./Stat/Vitality.ts";

export class CharacterSave {
    public readonly vitality: Vitality = new Vitality();
    public readonly stats: RacialStats;
    public experience: number = 0;

    constructor(
        public readonly name: string,
        race: Race,
    ) {
        this.bindStats();

        this.stats = race.generateStats();
    }

    private bindStats(): void {
        this.vitality.bindCharacterSave(this);
    }

    get level(): number {
        return CharacterHelper.getLevelByExperience(this.experience);
    }
}