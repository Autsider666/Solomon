import {GraphEdge} from "./GraphEdge.ts";

export class GraphNode<Identifier, NodeData, EdgeData> {
    private readonly edges: Set<GraphEdge<Identifier, EdgeData, NodeData>> = new Set<GraphEdge<Identifier, EdgeData, NodeData>>();

    constructor(
        public readonly id: Identifier,
        public readonly data: NodeData,
        // private readonly comparator: (a: T, b: T) => number,
    ) {
    }

    public getEdges(): ReadonlySet<GraphEdge<Identifier, EdgeData, NodeData>> {
        return this.edges;
    }

    public addEdge(edge: GraphEdge<Identifier, EdgeData, NodeData>): void {
        this.edges.add(edge);
    }

    public removeEdge(edge: GraphEdge<Identifier, EdgeData, NodeData>): void {
        this.edges.delete(edge);
    }

    public getParentNodes(excludeDirectional: boolean): ReadonlySet<GraphNode<Identifier, NodeData, EdgeData>> {
        const nodes = new Set<GraphNode<Identifier, NodeData, EdgeData>>();
        for (const edge of this.edges) {
            if (edge.target.id === this.id && (excludeDirectional || !edge.directional)) {
                nodes.add(edge.source);
            }
        }

        return nodes;
    }

    public getChildNodes(): ReadonlySet<GraphNode<Identifier, NodeData, EdgeData>> {
        const nodes = new Set<GraphNode<Identifier, NodeData, EdgeData>>();
        for (const edge of this.edges) {
            if (edge.source.id === this.id) {
                nodes.add(edge.target);
            }
        }

        return nodes;
    }

    public getReachableNodes(): ReadonlySet<GraphNode<Identifier, NodeData, EdgeData>> { //TODO isn't this the same as getChildNodes?
        const nodes = new Set<GraphNode<Identifier, NodeData, EdgeData>>();
        for (const edge of this.edges) {
            if (edge.target.id !== this.id) {
                nodes.add(edge.target);
            }
        }

        return nodes;
    }

    public equals(node: GraphNode<Identifier, NodeData, EdgeData>): boolean {
        return this.id === node.id;
    }
}