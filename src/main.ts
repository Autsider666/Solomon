import './style.css';
import {BreedBuilder} from "./Content/Monter/BreedBuilder.ts";
import {RaceBuilder} from "./Content/Race/RaceBuilder.ts";
import {RaceContent} from "./Content/Race/RaceContent.ts";
import {CharacterSave} from "./Engine/Character/CharacterSave.ts";
import {ExcaliburRenderer} from "./Excalibur/ExcaliburRenderer.ts";
import {SpriteSheetLoader} from "./Excalibur/SpriteSheetLoader.ts";
import {Coordinate} from "./Utility/Geometry/Shape/Coordinate.ts";

const renderer = new ExcaliburRenderer();

SpriteSheetLoader.loadAsSprite({
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
    coordinate: Coordinate.create(3, 12),
});

SpriteSheetLoader.loadAsSprite({
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
    coordinate: Coordinate.create(1, 10),
});

SpriteSheetLoader.loadAsSprite({
    key: 'human',
    imagePath: '/assets/DawnLike/Characters/Player0.png',
    spriteSheetOptions: {
        grid: {
            rows: 39,
            columns: 21,
            spriteHeight: 16,
            spriteWidth: 16
        },
    },
    coordinate: Coordinate.create(1, 1),
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
