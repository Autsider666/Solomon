import {Actor} from "../Core/Actor.ts";

export class Monster extends Actor {
    get maxHealth(): number {
        throw new Error("Method not implemented.");
    }
    
}