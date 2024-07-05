import {Motility} from "../../Engine/Stage/Motility.ts";
import {TileType} from "../../Engine/Stage/TileType.ts";

export class TileBuilder {
    protected constructor(
        protected name: string,
        protected sprite: string|null,
    ) {
    }

    static build(name: string, sprite: string|null): TileBuilder {
        return new TileBuilder(name, sprite);
    }

    public solid(): TileType {
        return new TileType(this.name, this.sprite, Motility.none);
    }

    public open(): TileType {
        return new TileType(this.name, this.sprite, Motility.flyAndWalk);
    }
}