import {TileType} from "../../Engine/Stage/TileType.ts";
import {TileBuilder} from "./TileBuilder.ts";

function tile(name: string, sprite: string | null): TileBuilder {
    return TileBuilder.build(name, sprite);
}

export const Tiles = {  //FIXME why split this between Tiles and TileType statics?
    floor: tile('floor', 'floor').open(),
    wall: tile('wall', 'wall').solid(),
} as const satisfies Record<string, TileType>;

// export class Tiles {
//     static readonly floor: TileType = this.tile('floor').open();
//     static readonly wall: TileType = this.tile('wall').solid();
//
//     private static tile(name: string): TileBuilder {
//         return TileBuilder.build(name);
//     }
// }