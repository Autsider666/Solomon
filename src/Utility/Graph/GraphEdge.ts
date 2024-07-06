import {GraphNode} from "./GraphNode.ts";

export type GraphEdgeOptions = {
    directional?: boolean,
    weight?: number,
}

export class GraphEdge<Identifier, EdgeData, NodeData> {
    public directional: boolean;
    public weight: number;

    constructor(
        public readonly source: GraphNode<Identifier, NodeData,EdgeData>,
        public readonly target: GraphNode<Identifier, NodeData,EdgeData>,
        public readonly data: EdgeData,
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

    public equals(edge: GraphEdge<Identifier, EdgeData, NodeData>): boolean {
        return edge.source.id === this.source.id
            && edge.target.id === this.target.id
            && edge.directional === this.directional;
    }
}