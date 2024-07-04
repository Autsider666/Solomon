import './style.css';
import {BreedBuilder} from "./Content/Monter/BreedBuilder.ts";
import {MonsterContent} from "./Content/Monter/MonsterContent.ts";
import {RaceBuilder} from "./Content/Race/RaceBuilder.ts";
import {RaceContent} from "./Content/Race/RaceContent.ts";
import {CharacterSave} from "./Engine/Character/CharacterSave.ts";
import {Game} from "./Engine/Core/Game.ts";
import {Coordinate} from "./Utility/Geometry/Shape/Coordinate.ts";

BreedBuilder.newBreed({
    name: 'orc',
    depth: 1,
    frequency: 1,
    health: 10
}).attack('attack[s]', 1);
BreedBuilder.finish();

RaceBuilder.newRace('human', 'boring');
RaceBuilder.finish();

const game = new Game({
    width: 100,
    height: 100
}, new CharacterSave('test', RaceContent.get('human')));

console.dir(MonsterContent.get('orc').spawn(game, new Coordinate(0, 0)));