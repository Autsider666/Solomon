import {Sprite, SpriteSheet, Vector} from "excalibur";

export type TileMaskMap = {
    0: Vector;
    1: Vector;
    2: Vector;
    3: Vector;
    4: Vector;
    5: Vector;
    6: Vector;
    7: Vector;
    8: Vector;
    9: Vector;
    10: Vector;
    11: Vector;
    12: Vector;
    13: Vector;
    14: Vector;
    15: Vector;
}

export class TileMaskHandler {
    constructor(
        private readonly spriteSheet: SpriteSheet,
        private readonly map: TileMaskMap,
        private readonly offset: Vector = new Vector(0, 0)
    ) {
    }

    getSprite(mask: number, offset: Vector = this.offset): Sprite | undefined {
        if (!(mask in this.map)) {
            return undefined;
        }

        const spritePos = this.map[mask as keyof TileMaskMap];
        return this.spriteSheet.getSprite(spritePos.x + offset.x, spritePos.y + offset.y);
    }
}