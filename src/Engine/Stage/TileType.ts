import {Graphic} from "excalibur";
import {GraphicContent} from "../../Content/Graphic/GraphicContent.ts";
import {Motility} from "./Motility.ts";

export class TileType {
    static uninitialized = new TileType('uninitialized', null, Motility.none);

    private readonly spriteIdentifier: string | null;
    private loadedSprite: Graphic | undefined;

    constructor(
        public readonly name: string,
        sprite: string | null,
        public readonly motility: Motility,
    ) {
        this.spriteIdentifier = sprite;
    }

    get graphic(): Graphic | undefined {
        if (!this.spriteIdentifier) {
            return undefined;
        }

        if (!this.loadedSprite) {
            this.loadedSprite = GraphicContent.get(this.spriteIdentifier);
        }

        return this.loadedSprite;
    }

    get isTraversable(): boolean {
        return this.canEnter(Motility.doorAndWalk);
    }

    get isWalkable(): boolean {
        return this.canEnter(Motility.walk);
    }

    canEnter(motility: Motility): boolean {
        return (this.motility.bitmask & motility.bitmask) != 0;
    }
}