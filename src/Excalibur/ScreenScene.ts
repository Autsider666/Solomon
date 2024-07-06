import {Actor, Engine, Keys, Scene, SceneActivationContext} from "excalibur";
import {GraphicContent} from "../Content/Graphic/GraphicContent.ts";
import {MoveAction} from "../Engine/Action/MoveAction.ts";
import {Character} from "../Engine/Character/Character.ts";
import {CharacterSave} from "../Engine/Character/CharacterSave.ts";
import {Game} from "../Engine/Core/Game.ts";
import {Dimensions} from "../Utility/Geometry/Dimensions.ts";
import {Direction} from "../Utility/Geometry/Direction.ts";
import {Coordinate} from "../Utility/Geometry/Shape/Coordinate.ts";
import {TileGrid} from "./TileGrid.ts";

export type ScreenData = {
    depth: number;
    dimensions: Dimensions,
    save: CharacterSave,
};

type GridLevel = 'background' | 'actor';

export class ScreenScene extends Scene<ScreenData> {
    private game!: Game;
    private grid!: TileGrid<GridLevel>;
    private playerActor!: Actor;

    onInitialize(engine: Engine) {
        engine.inputMapper.on(({keyboard}) => keyboard.wasPressed(Keys.W) || keyboard.wasPressed(Keys.Up) || keyboard.wasPressed(Keys.Num8),
            () => this.game.character.setNextAction(new MoveAction(Direction.north)));
        engine.inputMapper.on(({keyboard}) => keyboard.wasPressed(Keys.D) || keyboard.wasPressed(Keys.Right) || keyboard.wasPressed(Keys.Num6),
            () => this.game.character.setNextAction(new MoveAction(Direction.east)));
        engine.inputMapper.on(({keyboard}) => keyboard.wasPressed(Keys.S) || keyboard.wasPressed(Keys.Down) || keyboard.wasPressed(Keys.Num2),
            () => this.game.character.setNextAction(new MoveAction(Direction.south)));
        engine.inputMapper.on(({keyboard}) => keyboard.wasPressed(Keys.A) || keyboard.wasPressed(Keys.Left) || keyboard.wasPressed(Keys.Num4),
            () => this.game.character.setNextAction(new MoveAction(Direction.west)));
    }

    onActivate({data}: SceneActivationContext<ScreenData>) {
        if (!data) {
            throw new Error('Screen data missing!');
        }

        const tileSize: number = 16;

        this.game = new Game(data.dimensions, data.save);

        this.game.generate();

        this.grid = new TileGrid<GridLevel>(this, tileSize, data.dimensions);
        this.grid.createLayer('background', -10);

        const characterPosition = this.game.stage.findOpenTileCoordinate();
        if (!characterPosition) {
            throw new Error('Hmm, so not enough tries to find open tile');
        }

        this.game.character.position = characterPosition;
        this.grid.createLayer('actor', 1);


        this.playerActor = new Actor();
        this.playerActor.on('preupdate', () => {
            this.playerActor.pos.x = this.game.character.position.x * tileSize;
            this.playerActor.pos.y = this.game.character.position.y * tileSize;
        });

        this.add(this.playerActor);

        this.camera.strategy.lockToActor(this.playerActor);
        this.camera.zoom = 2;

        this.updateScreen();
    }

    onPreUpdate(): void {
        const result = this.game.update();
        if (result.dirty) {
            this.updateScreen();
        }
    }

    private updateScreen(): void {
        this.grid.iterateLayer('background', tile => {
            const sprite = this.game.stage.getTileAt(Coordinate.create(tile.x, tile.y)).graphic;
            tile.clearGraphics();
            if (sprite) {
                tile.addGraphic(sprite);
            }
        });


        this.grid.iterateLayer('actor', tile => {
            const actor = this.game.stage.getActorAt(Coordinate.create(tile.x, tile.y));
            tile.clearGraphics();
            if (actor instanceof Character) {
                tile.addGraphic(GraphicContent.get(actor.race));
            }
        });
    }
}