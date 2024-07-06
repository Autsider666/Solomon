import {GraphNode} from "./GraphNode.ts";

export type GraphEdgeOptions = {
    directional?: boolean,
    weight?: number,
}

export class GraphEdge<Identifier, Data> {
    public directional: boolean;
    public weight: number;

    constructor(
        public readonly source: GraphNode<Identifier, Data>,
        public readonly target: GraphNode<Identifier, Data>,
        {
            directional = false,
            weight = 0,
        }: GraphEdgeOptions = {},
    ) {
        this.directional = directional;
        this.weight = weight;
    }

    public delete(): void {
        this.source.removeEdge(this);
        this.target.removeEdge(this);
    }

    public equals(edge: GraphEdge<Identifier, Data>): boolean {
        return edge.source.id === this.source.id
            && edge.target.id === this.target.id
            && edge.directional === this.directional;
    }
}