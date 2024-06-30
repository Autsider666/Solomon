import {Color, Vector} from "excalibur";
import {Coordinate} from "../../Utility/Type/Dimensional.ts";
import {FieldOfViewComponent} from "../ECS/Component/FieldOfViewComponent.ts";
import {LightSourceComponent} from "../ECS/Component/LightSourceComponent.ts";
import {MovableComponent} from "../ECS/Component/MovableComponent.ts";
import {PlayerTag} from "../ECS/tags.ts";
import {BaseActor} from "./BaseActor.ts";

export class Player extends BaseActor {
    constructor(private readonly tileSize: number) {
        super({
            width: tileSize,
            height: tileSize,
            color: Color.Red,
            anchor: Vector.Zero,
        });

        this.addTag(PlayerTag);
        this.addComponent(new LightSourceComponent(10));
        this.addComponent(new FieldOfViewComponent(10));
        this.addComponent(new MovableComponent(100));
    }

    public setTilePos({x,y}:Coordinate):void {
        this.pos.x = x * this.tileSize;
        this.pos.y = y * this.tileSize;
    }
}