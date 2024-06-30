import Fraction from "fraction.js";
import {Coordinate} from "../../Type/Dimensional.ts";
import {CardinalDirection, Quadrant} from "./Quadrant.ts";
import {Row} from "./Row.ts";
import {Tile} from "./Tile.ts";
import {getSlope, isSymmetric} from "./Utility.ts";

export class SymmetricShadowCasting {
    private static directions: CardinalDirection[] = [
        CardinalDirection.North,
        CardinalDirection.East,
        CardinalDirection.South,
        CardinalDirection.West,
    ];

    static computeFieldOfView(
        origin: Readonly<Coordinate>,
        isBlocking: (coordinate: Readonly<Coordinate>) => boolean,
        markVisible: (coordinate: Readonly<Coordinate>) => void,
    ) {
        markVisible(origin);

        for (const direction of this.directions) {
            const quadrant = new Quadrant(direction, origin);

            const reveal = (tile: Tile): void => {
                markVisible(quadrant.transform(tile));
            };

            const isWall = (tile: Tile | undefined): boolean => {
                if (!tile) {
                    return false;
                }

                return isBlocking(quadrant.transform(tile));
            };

            const isFloor = (tile: Tile | undefined): boolean => {
                if (!tile) {
                    return false;
                }

                return !isBlocking(quadrant.transform(tile));
            };

            const scan = (row: Row): void => {
                let previousTile: Tile | undefined = undefined;

                for (const tile of row.getTiles()) {
                    if (isWall(tile) || isSymmetric(row, tile)) {
                        reveal(tile);
                    }

                    if (isWall(previousTile) && isFloor(tile)) {
                        row.startSlope = getSlope(tile);
                    }

                    if (isFloor(previousTile) && isWall(tile)) {
                        const nextRow = row.next();
                        nextRow.endSlope = getSlope(tile);
                        scan(nextRow);
                    }

                    previousTile = tile;
                }

                if (isFloor(previousTile)) {
                    scan(row.next());
                }
            };

            // const scanIterative = (startRow: Row): void => {
            //     const rows = [startRow];
            //     while (rows.length > 0) {
            //         const row = rows.pop();
            //         if (!row) {
            //             break;
            //         }
            //
            //         let previousTile: Tile | undefined = undefined;
            //         for (const tile of row.getTiles()) {
            //             if (isWall(tile) || isSymmetric(row, tile)) {
            //                 reveal(tile);
            //             }
            //
            //             if (isWall(previousTile) && isFloor(tile)) {
            //                 row.startSlope = getSlope(tile);
            //             }
            //
            //             if (isFloor(previousTile) && isWall(tile)) {
            //                 const nextRow = row.next();
            //                 nextRow.endSlope = getSlope(tile);
            //                 rows.unshift(nextRow);
            //             }
            //
            //             previousTile = tile;
            //         }
            //
            //         if (isFloor(previousTile)) {
            //             rows.unshift(row.next());
            //         }
            //     }
            // };

            const firstRow = new Row(1, new Fraction(-1), new Fraction(1));
            scan(firstRow);
        }
    }
}