import {Direction} from "../../../Utility/Type/Dimensional.ts";
import {BaseComponent} from "./BaseComponent.ts";

export class MovableComponent extends BaseComponent {
    public move: Direction | undefined = undefined;
    public nextMoveDelta: number = 0;

    constructor(public readonly moveDelta: number) {
        super();
    }

    getMove(delta: number): Direction | undefined {
        this.nextMoveDelta += delta;
        if (this.nextMoveDelta >= this.moveDelta && this.move !== undefined) {
            this.nextMoveDelta = 0;

            return this.move;
        }

        return undefined;
    }
}