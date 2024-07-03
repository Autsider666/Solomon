import {CharacterSave} from "../CharacterSave.ts";
import {Property} from "../Property.ts";
import {Stat} from "./Stat.ts";

export abstract class BaseStat extends Property<number> {
    private _save!: CharacterSave;

    abstract get stat(): Stat;

    get name(): string {
        return this.stat.toString();
    }

    bindCharacterSave(save: CharacterSave) {
        this._save = save;
        this._value = this._save.stats.getValueAtLevel(this.stat, this._save.level);
    }
}