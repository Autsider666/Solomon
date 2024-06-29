import {Sprite, Vector} from "excalibur";
import {AssetLoader} from "../AssetLoader.ts";

export class FloorAssetLoader extends AssetLoader {
    constructor(private readonly offset?: Vector) {
        super({
            imagePath: '/assets/DawnLike/Objects/Floor.png',
            spriteSheetOptions: {
                grid: {
                    rows: 39,
                    columns: 21,
                    spriteHeight: 16,
                    spriteWidth: 16
                },
            },
            tileMask: {
                "0": new Vector(1, 1),
                "1": new Vector(1, 0),
                "2": new Vector(2, 1),
                "3": new Vector(2, 0),
                "4": new Vector(1, 2),
                "5": new Vector(5, 1),
                "6": new Vector(2, 2),
                "7": new Vector(6, 1),
                "8": new Vector(0, 1),
                "9": new Vector(0, 0),
                "10": new Vector(3, 1),
                "11": new Vector(3, 0),
                "12": new Vector(0, 2),
                "13": new Vector(4, 1),
                "14": new Vector(3, 2),
                "15": new Vector(5, 0),
            },
        });
    }

    getSpriteByMask(mask: number, offset: Vector | undefined = this.offset): Sprite | undefined {
        return super.getSpriteByMask(mask, offset);
    }
}