import {RaceContent} from "../../Content/Race/RaceContent.ts";
import {CharacterSave} from "../Character/CharacterSave.ts";

type CharacterState = {
    name: string,
    race: string,
    experience: number,
}

export type State = {
    characters: CharacterState[];
}

export abstract class Storage {
    protected characters: CharacterSave[] = [];

    abstract saveStata(state: State): void;

    abstract loadStata(): State | undefined;

    public save(): void {
        const state: State = {characters: []};
        for (const character of this.characters) {
            state.characters.push({
                name: character.name,
                race: character.race.name,
                experience: character.experience,
            });
        }

        this.saveStata(state);
    }

    public load(): void {
        this.characters.length = 0;
        const state = this.loadStata();
        if (state === undefined) {
            return;
        }

        for (const {name, race} of state.characters) {
            this.characters.push(new CharacterSave(name, RaceContent.get(race)));
        }
    }
}