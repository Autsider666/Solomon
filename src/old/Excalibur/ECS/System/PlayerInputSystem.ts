import {Keys, Scene, System, SystemType, TagQuery, World} from "excalibur";
import {Direction} from "../../../Utility/Type/Dimensional.ts";
import {MovableComponent} from "../Component/MovableComponent.ts";
import {PlayerTag} from "../tags.ts";

export class PlayerInputSystem extends System {
    systemType: SystemType = SystemType.Update;
    // priority: number = SystemPriority.Highest;

    private direction: Direction | undefined = undefined;

    private readonly playerQuery: TagQuery<typeof PlayerTag>;

    constructor(world: World) {
        super();

        this.playerQuery = world.queryTags([PlayerTag]);
    }

    initialize(_world: World, scene: Scene): void {
        scene.input.inputMapper.on(({keyboard}) => keyboard.isHeld(Keys.W) || keyboard.isHeld(Keys.Num8),
            () => this.direction = {dX: 0, dY: -1});
        scene.input.inputMapper.on(({keyboard}) => keyboard.isHeld(Keys.S) || keyboard.isHeld(Keys.Num2),
            () => this.direction = {dX: 0, dY: 1});
        scene.input.inputMapper.on(({keyboard}) => keyboard.isHeld(Keys.A) || keyboard.isHeld(Keys.Num4),
            () => this.direction = {dX: -1, dY: 0});
        scene.input.inputMapper.on(({keyboard}) => keyboard.isHeld(Keys.D) || keyboard.isHeld(Keys.Num6),
            () => this.direction = {dX: 1, dY: 0});
    }

    update(): void {
        if (this.direction === undefined) {
            return;
        }

        for (const entity of this.playerQuery.entities) {
            const moveComponent = entity.get(MovableComponent);
            if (!moveComponent) {
                return;
            }

            moveComponent.move = this.direction;
        }

        this.direction = undefined;
    }

}