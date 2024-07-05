import {Color, Rectangle, Scene, SceneActivationContext} from "excalibur";
import {CharacterSave} from "../Engine/Character/CharacterSave.ts";
import {Game} from "../Engine/Core/Game.ts";
import {Dimensions} from "../Utility/Geometry/Dimensions.ts";
import {Coordinate} from "../Utility/Geometry/Shape/Coordinate.ts";
import {TileGrid} from "./TileGrid.ts";

export type ScreenData = {
    depth: number;
    dimensions: Dimensions,
    save: CharacterSave,
};

export class Screen extends Scene {
    onActivate({data}: SceneActivationContext<ScreenData>) {
        if (!data) {
            throw new Error('Screen data missing!');
        }

        const tileSize: number = 16;

        const game = new Game(data.dimensions, data.save);

        game.generate();

        const grid = new TileGrid<'background' | 'actor'>(this, tileSize, data.dimensions);
        grid.createLayer('background', -10, tile => {
            const sprite = game.stage.getTileAt(Coordinate.create(tile.x, tile.y)).sprite;
            if (sprite) {
                tile.addGraphic(sprite);
            }
        });

        const characterPosition = game.stage.findOpenTileCoordinate();
        if (!characterPosition) {
            throw new Error('Hmm, so not enough tries to find open tile');
        }

        game.character.position = characterPosition;
        grid.createLayer('actor', 1, tile => {
            if (characterPosition.x === tile.x && characterPosition.y === tile.y) {
                tile.addGraphic(new Rectangle({
                    width: tileSize,
                    height: tileSize,
                    color: Color.Red,
                }));
            }
        });
    }
}