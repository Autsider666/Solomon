import {BodyComponent, Entity, Query, System, SystemPriority, SystemType, Vector, World} from "excalibur";
import {Array2D} from "../../../Utility/Array2D.ts";
import {SymmetricShadowCasting} from "../../../Utility/FieldOfView/SymmetricShadowCasting/SymmetricShadowCasting.ts";
import {GridLayer} from "../../types.ts";
import {TileGrid} from "../../Utility/Tile/TileGrid.ts";
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
            const startingCoordinate = this.grid.getGridCoordinateByPoint(pos);
            const checkCoordinate = new Vector(0, 0);
            SymmetricShadowCasting.computeFieldOfView(
                startingCoordinate,
                coordinate => {
                    checkCoordinate.setTo(coordinate.x, coordinate.y);
                    return startingCoordinate.distance(checkCoordinate) > 10 || !this.grid.isFreeTile(coordinate);
                },
                coordinate => {
                    this.fovCache.set(coordinate, true);
                });
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