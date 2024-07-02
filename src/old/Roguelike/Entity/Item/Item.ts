import {Use, UseType} from "../../Use/Use.ts";
import {Entity} from "../Entity.ts";
import {Object} from "../Object.ts";


export abstract class Item extends Object {
    constructor(private readonly useCases: Use[]) {
        super();
    }

    useFor(type: UseType, something: Entity): void {
        for (const useCase of this.useCases) {
            if (useCase.type === type) {
                useCase.use(something);
            }
        }
    }
}