import {Attack} from "../../Engine/Core/Combat/Attack.ts";
import {Element} from "../../Engine/Core/Combat/Element.ts";
import {Noun} from "../../Engine/Core/Logging/Noun.ts";
import {Breed} from "../../Engine/Monster/Breed.ts";
import {MonsterContent} from "./MonsterContent.ts";

type RequiredBreedData = {
    name: string,
    depth: number,
    health: number,
    frequency: number,
}

export class BreedBuilder {
    private static _builder: BreedBuilder | undefined = undefined;

    protected _name: string;
    protected _depth: number;
    protected _health: number;
    protected _frequency: number;
    protected _speed: number = 0;
    protected _attacks: Attack[] = [];
    protected _tags: string[] = [];

    protected constructor({
                              name, depth, health, frequency
                          }: RequiredBreedData) {
        this._name = name;
        this._depth = depth;
        this._health = health;
        this._frequency = frequency;
    }

    static newBreed(data: RequiredBreedData): BreedBuilder {
        this.finish();

        this._builder = new BreedBuilder(data);

        return this._builder;
    }

    static finish(): void {
        if (!this._builder) {
            return;
        }

        const breed = this._builder.build();
        MonsterContent.add(breed, this._builder._frequency, this._builder._tags);
    }

    public build(): Breed {
        return new Breed(
            this._name,
            this._health,
            this._attacks,
            this._depth,
        );
    }

    public health(health: number): BreedBuilder {
        this._health = health;

        return this;
    }

    public attack(verb: string, damage: number, element?: Element, noun?: Noun): BreedBuilder {
        this._attacks.push(new Attack(noun, verb, damage, 0, element));

        return this;
    }
}