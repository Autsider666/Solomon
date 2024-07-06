import {Random, Tile, TileMap, Vector} from "excalibur";
import {Dimensions} from "../Utility/Geometry/Dimensions.ts";
import {Coordinate} from "../Utility/Geometry/Shape/Coordinate.ts";
import {AutoTileMap} from "./AutoTileMap.ts";

export class TileGrid<Identifier extends string = string> {
    private readonly tileMaps = new Map<Identifier, AutoTileMap>();

    private random = new Random();

    constructor(
        private readonly tileMapHandler: { add(tileMap: TileMap): void; },
        public readonly tileSize: number,
        public readonly dimensions: Dimensions,
    ) {
    }

    createLayer(identifier: Identifier, zIndex: number = 0, tileCallback?: (tile: Tile) => void): void {
        if (this.tileMaps.has(identifier)) {
            return;
        }

        const tileMap = new AutoTileMap({
            name: identifier,
            pos: Vector.Zero,
            rows: this.dimensions.height,
            columns: this.dimensions.width,
            tileHeight: this.tileSize,
            tileWidth: this.tileSize,
        });
        tileMap.z = zIndex;

        if (tileCallback) {
            tileMap.tiles.forEach(tileCallback);
        }

        this.tileMaps.set(identifier, tileMap);

        this.tileMapHandler.add(tileMap);
    }

    iterateLayer(identifier: Identifier, tileCallback: (tile: Tile) => void) {
        this.tileMaps.get(identifier)?.tiles.forEach(tileCallback);
    }

    getRandomFreeTile(): Vector {
        let tries = 100;
        while (tries > 0) {
            const x = this.random.integer(0, this.dimensions.width - 1);
            const y = this.random.integer(0, this.dimensions.height - 1);

            if (this.isFreeCoordinate(x, y)) {
                return new Vector(x, y);
            }

            tries--;
        }

        throw new Error('Hmmm, more tries?');
    }

    isFreeCoordinate(x: number, y: number, excludedLayers: Array<Identifier> = []): boolean {
        return this.iterateTileMaps<boolean>((tileMap, identifier) => {
            if (excludedLayers.includes(identifier)) {
                return;
            }

            const tile = tileMap.getTile(x, y);
            if (!tile || tile.solid) {
                return false;
            }
        }) ?? true;
    }

    isFreeTile(pos: Coordinate, excludedLayers: Array<Identifier> = []): boolean {
        return this.isFreeCoordinate(pos.x, pos.y, excludedLayers);
    }

    /** Callback stops early when returning a value **/
    private iterateTileMaps<TResponse = void>(tileMapCallback: (tileMap: TileMap, identifier: Identifier) => TResponse | void): TResponse | undefined {
        for (const [identifier, tileMap] of this.tileMaps.entries()) {
            const response = tileMapCallback(tileMap, identifier);
            if (response !== undefined) {
                return response;
            }
        }
    }

    getTile(identifier: Identifier, gridPos: Coordinate): Tile | undefined {
        return this.tileMaps.get(identifier)?.getTile(gridPos.x, gridPos.y) ?? undefined;
    }

    getTileMask(identifier: Identifier, {x, y}: Coordinate): number {
        return this.tileMaps.get(identifier)?.getMask(x, y) ?? 0;
    }

    getTileByPoint(identifier: Identifier, point: Vector): Tile | undefined {
        return this.tileMaps.get(identifier)?.getTileByPoint(point) ?? undefined;
    }

    getGridCoordinateByPoint(point: Vector): Vector {
        const vector = this.iterateTileMaps<Vector>(tilemap => {
            const tile = tilemap.getTileByPoint(point);
            if (tile) {
                return new Vector(tile.x, tile.y);
            }
        });

        if (!vector) {
            throw new Error('Failed to find grid coordinate for point.');
        }

        return vector;
    }
}