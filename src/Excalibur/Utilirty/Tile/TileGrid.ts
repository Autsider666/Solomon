import {Random, Tile, TileMap, Vector} from "excalibur";
import {Coordinate} from "../../../Utility/Type/Dimensional.ts";
import {AutoTileMap} from "./AutoTileMap.ts";

export class TileGrid<Identifier extends string = string> {
    private readonly tileMaps = new Map<Identifier, AutoTileMap>();

    private random = new Random();

    constructor(
        private readonly tileMapHandler: { add(tileMap: TileMap): void; },
        public readonly tileSize: number,
        public readonly height: number,
        public readonly width: number,
    ) {
    }

    createLayer(identifier: Identifier, zIndex: number = 0, tileCallback?: (tile: Tile) => void): void {
        if (this.tileMaps.has(identifier)) {
            return;
        }

        const tileMap = new AutoTileMap({
            name: identifier,
            pos: Vector.Zero,
            rows: this.height,
            columns: this.width,
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
            const x = this.random.integer(0, this.width - 1);
            const y = this.random.integer(0, this.height - 1);

            if (this.isFreeCoordinate(x, y)) {
                return new Vector(x, y);
            }

            tries--;
        }

        throw new Error('Hmmm, more tries?');
    }

    getTileByCoordinate(x: number, y: number): Vector { //TODO what does this do?
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            throw new Error('Invalid gridPos');
        }

        const tile = this.iterateTileMaps<Vector>(tileMap => tileMap.getTile(x, y).pos);
        if (tile === undefined) {
            throw new Error('Whoeps');
        }

        return tile;
    }

    isFreeCoordinate(x: number, y: number): boolean {
        return this.iterateTileMaps<boolean>(tileMap => {
            const tile = tileMap.getTile(x, y);
            if (tile.solid) {
                return false;
            }
        }) ?? true;
    }

    isFreeTile(pos: Vector): boolean {
        return this.isFreeCoordinate(pos.x, pos.y);
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

    getTile(identifier: Identifier, gridPos: Vector): Tile | undefined {
        return this.tileMaps.get(identifier)?.getTile(gridPos.x, gridPos.y) ?? undefined;
    }

    getTileMask(identifier: Identifier, {x, y}: Coordinate): number {
        return this.tileMaps.get(identifier)?.getMask(x, y) ?? 0;
    }

    getTileByPoint(identifier: Identifier, point: Vector): Tile | undefined {
        return this.tileMaps.get(identifier)?.getTileByPoint(point) ?? undefined;
    }
}