import {Graphic} from "excalibur";
import {Motility} from "./Motility.ts";
import {TileType} from "./TileType.ts";

export class Tile {
    public type: TileType = TileType.uninitialized;

    private _isOccluded: boolean = false;

    private _falloff: number = 0;

    public floorIllumination: number = 0;
    public actorIllumination: number = 0;
    private _isExplored: boolean = false;

    get falloff(): number {
        return this._falloff;
    }

    get isOccluded(): boolean {
        return this._isOccluded;
    }

    get isVisible(): boolean {
        return !this.isOccluded && this.illumination > this.falloff;
    }

    get illumination(): number {
        return this.floorIllumination + this.actorIllumination;
    }

    get isExplored(): boolean {
        return this._isExplored;
    }

    get isWalkable(): boolean {
        return this.type.isWalkable;
    }

    public updateExplored(force: boolean = false): boolean {
        if (!this._isExplored && (force || this.isVisible)) {
            this._isExplored = true;
            return true;
        }

        return false;
    }

    public updateVisibility(isOccluded: boolean, falloff: number): void {
        this._isOccluded = isOccluded;
        this._falloff = falloff;
    }

    get graphic(): Graphic | undefined {
        return this.type.graphic ?? undefined;
    }

    canEnter(motility: Motility): boolean {
        return this.type.canEnter(motility);
    }
}