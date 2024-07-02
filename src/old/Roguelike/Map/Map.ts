import {Dimensions} from "../../Utility/Type/Dimensional.ts";
import {MapLayer} from "./MapLayer.ts";

export class Map<LayerIdentifier = string> {
    private readonly layers: MapLayer<LayerIdentifier>[] = [];

    constructor(
        readonly dimensions: Dimensions
    ) {
    }

    public addMapLayer(layer: MapLayer<LayerIdentifier>): void {
        if (this.layers.includes(layer)) {
            return;
        }

        this.layers.push(layer);
    }

    getLayersOfType(layerType: LayerIdentifier): MapLayer<LayerIdentifier>[] {
        return this.layers.filter(layer => layer.type === layerType);
    }

    getLayersNotOfType(layerType: LayerIdentifier): MapLayer<LayerIdentifier>[] {
        return this.layers.filter(layer => layer.type !== layerType);
    }
}