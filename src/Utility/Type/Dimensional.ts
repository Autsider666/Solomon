import {Distinct} from "./Distinct.ts";

export type Coordinate = { x: number, y: number };
export type Direction<AllowedValues extends number = number> = Readonly<{ dX: AllowedValues, dY: AllowedValues }>;
export type Dimensions<Height extends number = number, Width extends number = number> = Readonly<{
    height: Height,
    width: Width
}>;
export type GridDimensions = Distinct<Dimensions, 'Grid'>;
export type ViewportDimensions = Distinct<Dimensions, 'Viewport'>;
