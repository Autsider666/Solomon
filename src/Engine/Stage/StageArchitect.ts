import {Tiles} from "../../Content/Tile/Tiles.ts";
import {Stage} from "./Stage.ts";

export class StageArchitect {
    constructor(private readonly stage: Stage) {
    }

    buildStage(): void {
        const bounds = this.stage.bounds;
        for (const coordinate of bounds.coordinatesInBounds()) {
            this.stage.getTileAt(coordinate).type = bounds.atEdge(coordinate) ? Tiles.wall : Tiles.floor;
        }
    }
}

