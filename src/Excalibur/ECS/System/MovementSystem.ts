import {BodyComponent, Query, System, SystemPriority, SystemType, World} from "excalibur";
import {Traversal} from "../../../Utility/Traversal.ts";
import {Coordinate} from "../../../Utility/Type/Dimensional.ts";
import {GridLayer} from "../../types.ts";
import {TileGrid} from "../../Utilirty/Tile/TileGrid.ts";
import {MovableComponent} from "../Component/MovableComponent.ts";
import {MovedTag} from "../tags.ts";

export class MovementSystem extends System {
    systemType: SystemType = SystemType.Update;
    priority: number = SystemPriority.Highest;

    private readonly movableQuery: Query<typeof MovableComponent | typeof BodyComponent>;

    constructor(
        world: World,
        private readonly tileSize: number,
        private readonly grid: TileGrid<GridLayer>,
    ) {
        super();

        this.movableQuery = world.query([MovableComponent, BodyComponent]);
    }

    update(elapsedMs: number): void {
        for (const entity of this.movableQuery.entities) {
            entity.removeTag(MovedTag);

            const movableComponent = entity.get(MovableComponent);
            const move = movableComponent.getMove(elapsedMs);
            if (move === undefined) {
                continue;
            }

            movableComponent.move = undefined;
            const pos = entity.get(BodyComponent).pos;
            const currentTile = this.grid.getTileByPoint('light', pos);
            if (!currentTile) {
                continue;
            }

            const nextTilePos = Traversal.getDestinationCoordinate<Coordinate>(currentTile, move);
            if (!this.grid.isFreeTile(nextTilePos)) {
                continue;
            }

            pos.x = nextTilePos.x * this.tileSize;
            pos.y = nextTilePos.y * this.tileSize;

            entity.addTag(MovedTag);
        }
    }
}