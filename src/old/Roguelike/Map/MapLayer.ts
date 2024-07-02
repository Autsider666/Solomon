import {Array2D} from "../../Utility/Array2D.ts";
import {Coordinate, Dimensions} from "../../Utility/Type/Dimensional.ts";
import {TileData} from "../TileData.ts";

export class MapLayer<LayerIdentifier = string, Tile = TileData> {
    readonly tiles: Array2D<Tile | null>;

    constructor(
        readonly dimensions: Dimensions,
        readonly zIndex: number,
        readonly name: string,
        readonly type: LayerIdentifier,
    ) {

        this.tiles = new Array2D<Tile | null>(dimensions, () => null);
    }

    iterateTiles(callback: (tile: Tile | null, coordinate: Coordinate) => Tile): void {
        this.tiles.iterateItems(callback);
    }

    get(coordinate: Coordinate): Tile | null {
        return this.tiles.get(coordinate);
    }

    set(coordinate: Coordinate, tile: Tile | null): void {
        this.tiles.set(coordinate, tile);
    }
}