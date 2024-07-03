import {TileType} from "./TileType.ts";

export class Tile {
    private _type: TileType = TileType.uninitialized;

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

    get type():TileType {
        return this._type;
    }

    get isWalkable():boolean {
        return this._type.isWalkable;
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
}