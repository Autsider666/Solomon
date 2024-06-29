import {TileMap} from "excalibur";

export class AutoTileMap extends TileMap {
    getMask(x: number, y: number): number {
        const north = this.getTile(x, y - 1)?.solid ? 1 : 0;
        const east = this.getTile(x + 1, y)?.solid ? 1 : 0;
        const south = this.getTile(x, y + 1)?.solid ? 1 : 0;
        const west = this.getTile(x - 1, y)?.solid ? 1 : 0;

        return 1 * north + 2 * east + 4 * south + 8 * west;
    }
}