import {GraphEdge} from "./GraphEdge.ts";

export class GraphNode<Identifier, Data> {
    private readonly edges: Set<GraphEdge<Identifier, Data>> = new Set<GraphEdge<Identifier, Data>>();

    constructor(
        public readonly id: Identifier,
        public readonly data?: Data,
        // private readonly comparator: (a: T, b: T) => number,
    ) {
    }

    public getEdges(): ReadonlySet<GraphEdge<Identifier, Data>> {
        return this.edges;
    }

    public addEdge(edge: GraphEdge<Identifier, Data>): void {
        this.edges.add(edge);
    }

    public removeEdge(edge: GraphEdge<Identifier, Data>): void {
        this.edges.delete(edge);
    }

    public getParentNodes(excludeDirectional: boolean): ReadonlySet<GraphNode<Identifier, Data>> {
        const nodes = new Set<GraphNode<Identifier, Data>>();
        for (const edge of this.edges) {
            if (edge.target.id === this.id && (excludeDirectional || !edge.directional)) {
                nodes.add(edge.source);
            }
        }

        return nodes;
    }

    public getChildNodes(): ReadonlySet<GraphNode<Identifier, Data>> {
        const nodes = new Set<GraphNode<Identifier, Data>>();
        for (const edge of this.edges) {
            if (edge.source.id === this.id) {
                nodes.add(edge.target);
            }
        }

        return nodes;
    }

    public getReachableNodes(): ReadonlySet<GraphNode<Identifier, Data>> { //TODO isn't this the same as getChildNodes?
        const nodes = new Set<GraphNode<Identifier, Data>>();
        for (const edge of this.edges) {
            if (edge.target.id !== this.id) {
                nodes.add(edge.target);
            }
        }

        return nodes;
    }

    public equals(node: GraphNode<Identifier, Data>): boolean {
        return this.id === node.id;
    }
}