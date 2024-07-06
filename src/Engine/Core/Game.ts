import {Dimensions} from "../../Utility/Geometry/Dimensions.ts";
import {Coordinate} from "../../Utility/Geometry/Shape/Coordinate.ts";
import {Queue} from "../../Utility/Queue.ts";
import {Action} from "../Action/Action.ts";
import {ActionResult} from "../Action/ActionResult.ts";
import {Character} from "../Character/Character.ts";
import {CharacterSave} from "../Character/CharacterSave.ts";
import {Stage} from "../Stage/Stage.ts";
import {StageArchitect} from "../Stage/StageArchitect.ts";
import {Actor} from "./Actor.ts";
import {Logger} from "./Logging/Logger.ts";

type UpdateResult = Readonly<{
    dirty: boolean,
}>

export class Game {
    public readonly log: Logger = new Logger();
    private readonly _stage: Stage;
    private readonly _character: Character;
    private readonly _actions: Queue<Action> = new Queue<Action>();
    private readonly _reactions: Action[] = [];

    constructor(dimensions: Dimensions, save: CharacterSave) {
        this._stage = new Stage(dimensions, this);

        this._character = new Character(this, new Coordinate(0, 0), save);

        this.stage.addActor(this._character);
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

    public update(): UpdateResult {
        let dirty: boolean = false;

        // eslint-disable-next-line no-constant-condition
        while (true) {
            while (!this._actions.isEmpty()) {
                let action = this._actions.peek();
                if (action === undefined) {
                    break;
                }

                let result: ActionResult | undefined = action.perform();

                while (result?.alternative) {
                    this._actions.dequeue();
                    action = result.alternative;
                    this._actions.enqueue(action);

                    result = action.perform();
                }

                while (this._reactions.length > 0) {
                    let reaction = this._reactions.pop();
                    result = reaction?.perform();

                    while (result?.alternative) {
                        reaction = result.alternative;
                        result = action.perform();
                    }

                    if (!result?.succeeded) {
                        throw new Error('Reactions should never fail.');
                    }
                }

                dirty = true;

                if (result.done) {
                    this._actions.dequeue();

                    if (result.succeeded && action.consumesEnergy) {
                        action.actor.finishTurn(action);
                        this._stage.advanceActor();
                    }

                    if (action.actor === this.character) {
                        return {
                            dirty,
                        };
                    }
                }
            }

            //TODO add and update fluids using cellular automata?

            while (this._actions.isEmpty()) {
                const actor: Actor = this.stage.currentActor;

                if (actor.energy.canTakeTurn && actor.needsInput) {
                    return {dirty};
                }

                if (actor.energy.canTakeTurn || actor.energy.gain(actor.speed)) {
                    if (actor.needsInput) {
                        return {dirty};
                    }

                    const action = actor.getAction();
                    if (action) {
                        this._actions.enqueue(action);
                    }
                } else {
                    this.stage.advanceActor();
                }

                //TODO Handle idle stuff?
            }
        }
    }
}