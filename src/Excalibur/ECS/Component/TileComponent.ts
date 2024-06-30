import {Raster, Tile, Vector} from "excalibur";
import {BaseComponent} from "./BaseComponent.ts";

export class TileComponent extends BaseComponent {
    public readonly pos: Vector;
    private readonly graphic: Raster;

    public visible: boolean = true;

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
        return this.graphic.color.a;
    }

    set alpha(alpha: number) {
        this.graphic.color.a = alpha;
    }

    // get visible(): boolean {
    //     return this.tile.solid;
    // }
    //
    // set visible(visible: boolean) {
    //     this.tile.solid = visible;
    // }
}