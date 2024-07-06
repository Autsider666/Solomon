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
    private readonly _actors: Actor[] = [];
    private _currentActorIndex: number = 0;
    private readonly tiles: Array2D<Tile>;
    private readonly _actorsByTile: Array2D<Actor | undefined>;

    get actors(): ReadonlyArray<Actor> {
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

    get currentActor(): Actor {
        const actor = this._actors[this._currentActorIndex];
        if (!actor) {
            throw new Error('No currentActor');
        }

        return actor;
    }

    public advanceActor(): void {
        this._currentActorIndex = (this._currentActorIndex + 1) % this._actors.length;
    }

    public addActor(actor: Actor): void {
        if (this._actorsByTile.get(actor.position)) {
            throw new Error('Actor already exists in stage.');
        }

        this._actors.push(actor);
        this._actorsByTile.set(actor.position, actor);
    }

    public removeActor(actor: Actor): void {
        if (this._actorsByTile.get(actor.position) !== actor) {
            throw new Error('Actor position does not match their tile.');
        }

        const index = this._actors.indexOf(actor);
        if (this._currentActorIndex > index) {
            this._currentActorIndex--;
        }

        this._actors.splice(index, 1);

        this._actorsByTile.set(actor.position, undefined);
    }

    moveActor(from: Coordinate, to: Coordinate) {
        const actor = this._actorsByTile.get(from);
        this._actorsByTile.set(from, undefined);
        if (actor) {
            actor.position = to;
        }

        const target = this._actorsByTile.get(to);
        this._actorsByTile.set(to, actor);
        if (target) {
            target.position = from; //FIXME Can actors move actors?
        }
    }
}