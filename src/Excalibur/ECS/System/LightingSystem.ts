import {BodyComponent, Entity, Query, System, SystemPriority, SystemType, Vector, World} from "excalibur";
import {Array2D} from "../../../Utility/Array2D.ts";
import {GridLayer} from "../../types.ts";
import {TileGrid} from "../../Utilirty/Tile/TileGrid.ts";
import {LightSourceComponent} from "../Component/LightSourceComponent.ts";
import {TileComponent} from "../Component/TileComponent.ts";

export class LightingSystem extends System {
    systemType: SystemType = SystemType.Update;
    priority: number = SystemPriority.Lower;

    private readonly lightMap: Array2D<number>;

    private readonly lightSourceQuery: Query<typeof LightSourceComponent | typeof BodyComponent>;

    private readonly tileMap: Array2D<Entity<TileComponent> | undefined>;

    private readonly tileQuery: Query<typeof TileComponent>;

    constructor(
        world: World,
        private readonly grid: TileGrid<GridLayer>,
    ) {
        super();

        this.lightSourceQuery = world.query([LightSourceComponent, BodyComponent]);

        this.lightMap = new Array2D<number>(grid, () => 1);

        this.tileMap = new Array2D<Entity<TileComponent> | undefined>(this.grid, () => undefined);

        this.tileQuery = world.query([TileComponent]);
        this.tileQuery.entityAdded$.subscribe(entity => {
            this.tileMap.set(entity.get(TileComponent).pos, entity);
        });
    }

    update(): void {
        // let dirty = false;
        // for (const entity of this.lightSourceQuery.entities) {
        //     const body = entity.get(BodyComponent);
        //     console.log(entity,body.pos, body.oldPos);
        //     if (body.pos.distance(body.oldPos) === 0) {
        //         continue;
        //     }
        //
        //     dirty = true;
        // }
        //
        // if (!dirty) {
        //     return;
        // }

        this.lightMap.clear();

        for (const entity of this.lightSourceQuery.entities) {
            const body = entity.get(BodyComponent);
            const lightSource = entity.get(LightSourceComponent);

            const tile = this.grid.getTileByPoint('light', body.pos);
            if (!tile) {
                throw new Error('No tile?');
            }

            const pos = new Vector(0, 0);
            for (const [{x, y}, alpha] of lightSource.potentialTiles) {
                pos.setTo(x + tile.x, y + tile.y);
                if (!this.lightMap.containsCoordinate(pos)) {
                    // console.warn('out of bounds', pos);
                    continue;
                }

                const currentTile = this.grid.getTileByPoint('light', pos);
                if (!currentTile) {
                    throw new Error('No currentTile?');
                }

                const currentAlpha = this.lightMap.get(pos);
                if (alpha < currentAlpha) {
                    this.lightMap.set(pos, alpha);
                }
            }
        }

        this.tileMap.iterateItems((entity, coordinate) => {
            if (entity === undefined) {
                return;
            }

            const tile = entity.get(TileComponent);
            tile.alpha = tile.visible ? this.lightMap.get(coordinate) : 1;
        });
    }
}