import {Sprite} from "excalibur";
import {SpriteContent} from "../../Content/Graphic/SpriteContent.ts";
import {Motility} from "./Motility.ts";

export class TileType {
    static uninitialized = new TileType('uninitialized', null, Motility.none);

    private readonly spriteIdentifier: string | null;
    private loadedSprite: Sprite | undefined;

    constructor(
        public readonly name: string,
        sprite: string | null,
        public readonly motility: Motility,
    ) {
        this.spriteIdentifier = sprite;
    }

    get sprite(): Sprite | undefined {
        if (!this.spriteIdentifier) {
            return undefined;
        }

        if (!this.loadedSprite) {
            this.loadedSprite = SpriteContent.get(this.spriteIdentifier);
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