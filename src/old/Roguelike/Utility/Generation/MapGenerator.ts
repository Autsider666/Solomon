import {Random} from "excalibur";
import {Dimensions} from "../../../Utility/Type/Dimensional.ts";
import {Map} from "../../Map/Map.ts";
import {MapLayer} from "../../Map/MapLayer.ts";

type WorldGeneratorSettings = {
    dimensions: Dimensions,
}

export class MapGenerator {
    static generateMap(seed: number, settings: WorldGeneratorSettings): Map {
        const map = new Map(settings.dimensions);

        const wallLayer = new MapLayer(settings.dimensions, 0, 'Main', 'Wall');
        wallLayer.iterateTiles(() => ({
            seen: false,
            transparent: false,
            visible: true,
            walkable: false,
        }));

        const random = new Random(seed);

        console.log(random.next());

        return map;
    }
}