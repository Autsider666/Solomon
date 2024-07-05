import {Array2D} from "../../Utility/Array2D.ts";
import {Dimensions} from "../../Utility/Geometry/Dimensions.ts";
import {Coordinate} from "../../Utility/Geometry/Shape/Coordinate.ts";
import {Rectangle} from "../../Utility/Geometry/Shape/Rectangle.ts";
import {Random} from "../../Utility/Random.ts";
import {Actor} from "../Core/Actor.ts";
import {Game} from "../Core/Game.ts";
import {Monster} from "../Monster/Monster.ts";
import {Tile} from "./Tile.ts";

export class Stage {
    private readonly _actors: Set<Actor> = new Set<Actor>();
    private readonly tiles: Array2D<Tile>;
    private readonly _actorsByTile: Array2D<Actor | undefined>;

    get actors(): ReadonlySet<Actor> {
        return this._actors;
    }

    get bounds(): Rectangle {
        return this.tiles.bounds;
    }

    constructor(
        dimensions: Dimensions,
        private readonly game: Game,
    ) {
        this.tiles = Array2D.generate(dimensions, () => new Tile());
        this._actorsByTile = new Array2D<Actor | undefined>(dimensions, undefined); //TODO add set that only returns actors
    }

    public getTileAt(coordinate: Coordinate): Tile {
        return this.tiles.get(coordinate);
    }

    public getActorAt(coordinate: Coordinate): Actor | undefined {
        return this._actorsByTile.get(coordinate);
    }

    exploreAt(coordinate: Coordinate, force: boolean = false): void {
        const tile = this.tiles.get(coordinate);
        if (!tile.updateExplored(force)) {
            return;
        }

        if (!tile.isVisible) {
            return;
        }

        const actor = this.getActorAt(coordinate);
        if (actor && actor instanceof Monster) {
            this.game.character.seeMonster(actor);
        }
    }

    public findOpenTileCoordinate(tries: number = 100): Coordinate | undefined {
        while (tries > 0) {
            const coordinate = Random.coordinateInRectangle(this.tiles.bounds);

            if (this.getTileAt(coordinate).isWalkable && this.getActorAt(coordinate) === undefined) {
                return coordinate;
            }

            tries--;
        }

        return undefined;
    }
}