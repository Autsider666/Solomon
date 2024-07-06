import {GraphNode} from "./GraphNode.ts";

export class GraphRoute<Identifier, NodeData, EdgeData> {
    constructor(
        public readonly path: ReadonlyArray<GraphNode<Identifier, NodeData, EdgeData>>,
        public readonly weight: number,
    ) {
        if (path.length === 0) {
            throw new Error('Path is expected to contain at least one Node.');
        }
    }

    public get start(): GraphNode<Identifier, NodeData, EdgeData> {
        return this.path[0];
    }

    public get end(): GraphNode<Identifier, NodeData, EdgeData> {
        return this.path[this.path.length - 1];
    }

    get length(): number {
        return this.path.length;
    }
}