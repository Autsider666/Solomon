import {Sprite, Vector} from "excalibur";
import {AssetLoader} from "../AssetLoader.ts";

export class WallAssetLoader extends AssetLoader {
    constructor(private readonly offset?: Vector) {
        super({
            imagePath: '/assets/DawnLike/Objects/Wall.png',
            spriteSheetOptions: {
                grid: { //FIXME it does not contain the right size yet. Works for now
                    rows: 39,
                    columns: 21,
                    spriteHeight: 16,
                    spriteWidth: 16
                },
            },
            tileMask: {
                // "0": new Vector(3, 0), // Maybe more for inside multi layer walls?
                "0": new Vector(1, 1),
                "1": new Vector(1, 1),
                // "2": new Vector(1, 1), // But twisted 90 degrees
                "2": new Vector(0, 2),
                "3": new Vector(0, 2),
                "4": new Vector(1, 1), // But twisted 180 degrees
                "5": new Vector(0, 1),
                "6": new Vector(0, 0),
                "7": new Vector(3, 1),
                // "8": new Vector(1, 1), // But twisted 270 degrees
                "8": new Vector(2, 2),
                "9": new Vector(2, 2),
                "10": new Vector(1, 0),
                "11": new Vector(4, 2),
                "12": new Vector(2, 0),
                "13": new Vector(5, 1),
                "14": new Vector(4, 0),
                "15": new Vector(4, 1),
            },
        });
    }

    getSpriteByMask(mask: number, offset: Vector | undefined = this.offset): Sprite | undefined {
        return super.getSpriteByMask(mask, offset);
    }
}