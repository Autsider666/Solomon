import {SpriteSheet, SpriteSheetGridOptions, Vector} from "excalibur";
import {ImageSourceContent} from "../Content/Graphic/ImageSourceContent.ts";
import {SpriteContent} from "../Content/Graphic/SpriteContent.ts";
import {Coordinate} from "../Utility/Geometry/Shape/Coordinate.ts";

type TileMaskMap = {
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

export class SpriteSheetLoader {
    static load({key, imagePath, spriteSheetOptions, tileMask, offset = Coordinate.create(0, 0)}: {
        key: string,
        imagePath: string,
        spriteSheetOptions: Omit<SpriteSheetGridOptions, 'image'>,
        tileMask: TileMaskMap,
        offset?: Coordinate,
    }): void {
        ImageSourceContent.add(key, imagePath);
        const spriteSheet = SpriteSheet.fromImageSource({
            image: ImageSourceContent.get(key),
            ...spriteSheetOptions
        });

        const {x, y} = tileMask[0];
        SpriteContent.add(key, spriteSheet.getSprite(x + offset.x, y + offset.y));
    }
}