import {BodyComponent, Entity, Query, System, SystemPriority, SystemType, World} from "excalibur";
import {Array2D} from "../../../Utility/Array2D.ts";
import {Traversal} from "../../../Utility/Traversal.ts";
import {Coordinate} from "../../../Utility/Type/Dimensional.ts";
import {GridLayer} from "../../types.ts";
import {TileGrid} from "../../Utilirty/Tile/TileGrid.ts";
import {FieldOfViewComponent} from "../Component/FieldOfViewComponent.ts";
import {TileComponent} from "../Component/TileComponent.ts";

const VisibleTag: string = 'VISIBLE';

export class FieldOfViewSystem extends System {
    systemType: SystemType = SystemType.Update;
    priority: number = SystemPriority.Average;

    private readonly fieldOfViewQuery: Query<typeof FieldOfViewComponent | typeof BodyComponent>;

    private readonly tileQuery: Query<typeof TileComponent>;

    private readonly visibleTiles: Set<Entity<TileComponent>> = new Set<Entity<TileComponent>>();

    private readonly tileMap: Array2D<Entity<TileComponent> | undefined>;

    private readonly fovCache: Array2D<boolean | undefined>;

    constructor(
        world: World,
        private readonly grid: TileGrid<GridLayer>,
    ) {
        super();

        this.fieldOfViewQuery = world.query([FieldOfViewComponent, BodyComponent]);

        this.tileQuery = world.query([TileComponent]);

        this.tileMap = new Array2D<Entity<TileComponent> | undefined>(this.grid, () => undefined);

        this.tileQuery.entityAdded$.subscribe(entity => {
            this.tileMap.set(entity.get(TileComponent).pos, entity);
            this.updateEntity(entity);
        });

        this.fovCache = new Array2D<boolean | undefined>(this.grid, () => undefined);
    }

    update(): void {
        this.fovCache.clear();

        for (const entity of this.fieldOfViewQuery.entities) {
            const pos = entity.get(BodyComponent).pos;
            const currentTile = this.grid.getTileByPoint('light', pos);
            if (!currentTile) {
                throw new Error('que?');
            }

            const fovComponent = entity.get(FieldOfViewComponent);
            for (const gridPos of fovComponent.potentialTiles) {
                Traversal.iterateBetweenTwoCoordinates<Coordinate>(currentTile, {
                    x: gridPos.x + currentTile.x,
                    y: gridPos.y + currentTile.y,
                }, coordinate => {
                    let visible: boolean | undefined = this.fovCache.get(coordinate);
                    if (visible === undefined) {
                        visible = this.grid.isFreeTile(coordinate);

                        this.fovCache.set(coordinate, visible);
                    }

                    return visible;
                });
            }
        }

        this.tileMap.iterateItems((entity, coordinate) => {
            if (entity === undefined) {
                return;
            }

            entity.get(TileComponent).visible = this.fovCache.get(coordinate);
        });
    }

    private updateEntity(entity: Entity<TileComponent>, visible?: boolean): void {
        if (visible !== undefined) {
            if (visible) {
                entity.addTag(VisibleTag);
            } else {
                entity.removeTag(VisibleTag);
            }
        }

        if (entity.hasTag(VisibleTag)) {
            this.visibleTiles.add(entity);
            entity.get(TileComponent).visible = true;
        } else {
            this.visibleTiles.delete(entity);
            entity.get(TileComponent).visible = false;
        }
    }
}