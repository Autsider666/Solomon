import {Dimensions} from "../../Utility/Geometry/Dimensions.ts";
import {Coordinate} from "../../Utility/Geometry/Shape/Coordinate.ts";
import {Character} from "../Character/Character.ts";
import {CharacterSave} from "../Character/CharacterSave.ts";
import {Stage} from "../Stage/Stage.ts";
import {StageArchitect} from "../Stage/StageArchitect.ts";
import {Logger} from "./Logging/Logger.ts";

export class Game {
    public readonly log: Logger = new Logger();
    private readonly _stage: Stage;
    private readonly _character: Character;

    constructor(dimensions: Dimensions, save: CharacterSave) {
        this._stage = new Stage(dimensions, this);

        this._character = new Character(this, Coordinate.zero, save);
    }

    get stage(): Stage {
        return this._stage;
    }

    get character(): Character {
        return this._character;
    }

    public generate(): void {
        const architect = new StageArchitect(this._stage);

        architect.buildStage();
    }
}