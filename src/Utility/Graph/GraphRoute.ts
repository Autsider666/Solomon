import {GraphNode} from "./GraphNode.ts";

export class GraphRoute<Identifier, Data> {
    constructor(
        public readonly path: ReadonlyArray<GraphNode<Identifier, Data>>,
        public readonly weight: number,
    ) {
        if (path.length === 0) {
            throw new Error('Path is expected to contain at least one Node.');
        }

        // if (this.start.equals(this.end)) {
        //     return;
        // }
        //
        // //TODO handle route validation?
    }

    public get start(): GraphNode<Identifier, Data> {
        return this.path[0];
    }

    public get end(): GraphNode<Identifier, Data> {
        return this.path[this.path.length - 1];
    }

    get length(): number {
        return this.path.length;
    }
}