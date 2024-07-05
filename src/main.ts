import './style.css';
import {Vector} from "excalibur";
import {BreedBuilder} from "./Content/Monter/BreedBuilder.ts";
import {RaceBuilder} from "./Content/Race/RaceBuilder.ts";
import {RaceContent} from "./Content/Race/RaceContent.ts";
import {CharacterSave} from "./Engine/Character/CharacterSave.ts";
import {ExcaliburRenderer} from "./Excalibur/ExcaliburRenderer.ts";
import {SpriteSheetLoader} from "./Excalibur/SpriteSheetLoader.ts";
import {Coordinate} from "./Utility/Geometry/Shape/Coordinate.ts";

const renderer = new ExcaliburRenderer();

SpriteSheetLoader.load({
    key: 'wall',
    imagePath: '/assets/DawnLike/Objects/Wall.png',
    spriteSheetOptions: {
        grid: { //FIXME still...
            rows: 39,
            columns: 21,
            spriteHeight: 16,
            spriteWidth: 16
        },
    },
    tileMask: {
        // "0": new Vector(3, 0), // Maybe more for inside multi layer walls?
        "0": new Vector(1, 1),
        "1": new Vector(1, 1),
        // "2": new Vector(1, 1), // But twisted 90 degrees
        "2": new Vector(0, 2),
        "3": new Vector(0, 2),
        "4": new Vector(1, 1), // But twisted 180 degrees
        "5": new Vector(0, 1),
        "6": new Vector(0, 0),
        "7": new Vector(3, 1),
        // "8": new Vector(1, 1), // But twisted 270 degrees
        "8": new Vector(2, 2),
        "9": new Vector(2, 2),
        "10": new Vector(1, 0),
        "11": new Vector(4, 2),
        "12": new Vector(2, 0),
        "13": new Vector(5, 1),
        "14": new Vector(4, 0),
        "15": new Vector(4, 1),
    },
    offset: Coordinate.create(0, 6),
});

SpriteSheetLoader.load({
    key: 'floor',
    imagePath: '/assets/DawnLike/Objects/Floor.png',
    spriteSheetOptions: {
        grid: {
            rows: 39,
            columns: 21,
            spriteHeight: 16,
            spriteWidth: 16
        },
    },
    tileMask: {
        "0": new Vector(1, 1),
        "1": new Vector(1, 0),
        "2": new Vector(2, 1),
        "3": new Vector(2, 0),
        "4": new Vector(1, 2),
        "5": new Vector(5, 1),
        "6": new Vector(2, 2),
        "7": new Vector(6, 1),
        "8": new Vector(0, 1),
        "9": new Vector(0, 0),
        "10": new Vector(3, 1),
        "11": new Vector(3, 0),
        "12": new Vector(0, 2),
        "13": new Vector(4, 1),
        "14": new Vector(3, 2),
        "15": new Vector(5, 0),
    },
    offset: Coordinate.create(0, 3),
});

BreedBuilder.newBreed({
    name: 'orc',
    depth: 1,
    frequency: 1,
    health: 10
}).attack('attack[s]', 1);
BreedBuilder.finish();

RaceBuilder.newRace('human', 'boring');
RaceBuilder.finish();

await renderer.start();

const save = new CharacterSave('test', RaceContent.get('human'));

await renderer.loadLevel({
    save,
    dimensions: {
        width: 10,
        height: 10
    },
    depth: 0,
});
