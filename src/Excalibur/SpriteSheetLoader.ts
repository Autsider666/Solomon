import {SpriteSheet, SpriteSheetGridOptions} from "excalibur";
import {GraphicContent} from "../Content/Graphic/GraphicContent.ts";
import {ImageSourceContent} from "../Content/Graphic/ImageSourceContent.ts";
import {SpriteSheetContent} from "../Content/Graphic/SpriteSheetContent.ts";
import {Coordinate} from "../Utility/Geometry/Shape/Coordinate.ts";

// type TileMaskMap = {
//     0: Vector;
//     1: Vector;
//     2: Vector;
//     3: Vector;
//     4: Vector;
//     5: Vector;
//     6: Vector;
//     7: Vector;
//     8: Vector;
//     9: Vector;
//     10: Vector;
//     11: Vector;
//     12: Vector;
//     13: Vector;
//     14: Vector;
//     15: Vector;
// }

export class SpriteSheetLoader {
    static loadAsSprite({key, imagePath, spriteSheetOptions, coordinate}: {
        key: string,
        imagePath: string,
        spriteSheetOptions: Omit<SpriteSheetGridOptions, 'image'>,
        coordinate: Coordinate,
    }): void {
        const spriteSheet = this.loadSpriteSheet(key, imagePath, spriteSheetOptions);
        GraphicContent.add(key, spriteSheet.getSprite(coordinate.x, coordinate.y));
    }

    // static loadAsAnimation({key, imagePath, spriteSheetOptions, offset = Coordinate.create(0, 0)}: {
    //     key: string,
    //     imagePath: string,
    //     spriteSheetOptions: Omit<SpriteSheetGridOptions, 'image'>,
    //     offset?: Coordinate,
    // }): void {
    //
    //
    //     GraphicContent.add(key, Animation.fromSpriteSheetCoordinates({
    //         spriteSheet: this.loadSpriteSheet(key, imagePath, spriteSheetOptions),
    //         frameCoordinates: [
    //
    //         ],
    //     }));
    // }

    private static loadSpriteSheet(key: string, imagePath: string, spriteSheetOptions: Omit<SpriteSheetGridOptions, 'image'>): SpriteSheet {
        if (!SpriteSheetContent.has(key)) {
            ImageSourceContent.add(key, imagePath);
            SpriteSheetContent.add(key, key, spriteSheetOptions);
        }

        return SpriteSheetContent.get(key);
    }
}