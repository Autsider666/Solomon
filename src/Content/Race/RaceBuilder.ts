import {Race} from "../../Engine/Character/Race/Race.ts";
import {Stat, StatList} from "../../Engine/Character/Stat/Stat.ts";
import {RaceContent} from "./RaceContent.ts";

export class RaceBuilder {
    private static _builder: RaceBuilder | undefined = undefined;

    protected _name: string;
    protected _description: string = "";
    protected _stats: Partial<StatList> = {};

    protected constructor(name: string, description: string) {
        this._name = name;
        this._description = description;
    }

    static newRace(name: string, description: string): RaceBuilder {
        this.finish();

        this._builder = new RaceBuilder(name, description);

        return this._builder;
    }

    static finish(): void {
        if (!this._builder) {
            return;
        }

        RaceContent.add(this._builder.build());
    }

    public build(): Race {
        return new Race(
            this._name,
            this._description,
            {
                'Vitality': this._stats["Vitality"] ?? 0,
            }
        );
    }

    public stat(type: Stat, value: number): RaceBuilder {
        this._stats[type] = value;

        return this;
    }
}