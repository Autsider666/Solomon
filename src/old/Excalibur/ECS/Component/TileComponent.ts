import {Raster, Tile, Vector} from "excalibur";
import {BaseComponent} from "./BaseComponent.ts";

export class TileComponent extends BaseComponent {
    public readonly pos: Vector;
    private readonly graphic: Raster;

    private inFieldOfView: boolean = true;

    private lighting: number = 0;

    constructor(
        public readonly tile: Tile,
    ) {
        super();

        this.pos = new Vector(tile.x, tile.y);

        for (const graphic of tile.getGraphics()) {
            if (graphic instanceof Raster) {
                this.graphic = graphic;
                return;
            }
        }

        throw new Error('Tile contains no valid graphic');
    }

    get alpha(): number {
        return this.lighting;
    }

    set alpha(alpha: number) {
        this.lighting = alpha;
        this.updateTile();
    }

    get visible(): boolean {
        return this.inFieldOfView;
    }

    set visible(visible: boolean) {
        this.inFieldOfView = visible;
        this.updateTile();
    }

    private updateTile(): void {
        this.graphic.color.a = this.inFieldOfView ? this.lighting : 1;
    }
}