import {GraphEdge, GraphEdgeOptions} from "./GraphEdge.ts";
import {GraphNode} from "./GraphNode.ts";
import {GraphRoute} from "./GraphRoute.ts";

type RouteFindQuery<Identifier> = {
    from: Identifier,
    to?: Identifier,
    where?: {
        length: number,
    }
}

export class Graph<Identifier, NodeData, EdgeData> {
    private readonly nodes: Map<Identifier, GraphNode<Identifier, NodeData, EdgeData>> = new Map<Identifier, GraphNode<Identifier, NodeData, EdgeData>>();
    private readonly edges: GraphEdge<Identifier, EdgeData, NodeData>[] = [];

    // NODE
    public getNode(id: Identifier): GraphNode<Identifier, NodeData, EdgeData> | undefined {
        return this.nodes.get(id);
    }

    public addNode(id: Identifier, data: NodeData): GraphNode<Identifier, NodeData, EdgeData> {
        let node: GraphNode<Identifier, NodeData, EdgeData> | undefined = this.nodes.get(id);
        if (node) {
            return node;
        }

        node = new GraphNode<Identifier, NodeData, EdgeData>(id, data);

        this.nodes.set(id, node);
        return node;
    }

    public hasNode(node: Identifier | GraphNode<Identifier, NodeData, EdgeData>): boolean {
        if (node instanceof GraphNode) {
            node = node.id;
        }

        return this.nodes.has(node);
    }

    public removeNode(idOrNode: Identifier | GraphNode<Identifier, NodeData, EdgeData>): boolean {
        let id: Identifier;
        let node: GraphNode<Identifier, NodeData, EdgeData> | undefined;
        if (idOrNode instanceof GraphNode) {
            node = idOrNode;
            id = idOrNode.id;
        } else {
            node = this.nodes.get(idOrNode);
            id = idOrNode;
        }

        if (!node) {
            return false;
        }

        this.nodes.delete(id);

        for (const edge of node.getEdges()) {
            this.removeEdge(edge);
        }

        return true;
    }

    // EDGE
    public getEdge(source: Identifier, target: Identifier, directional?: boolean): GraphEdge<Identifier, EdgeData, NodeData> | undefined {
        for (const edge of this.edges) {
            if (edge.source.id === source && edge.target.id === target && (directional === undefined || edge.directional === directional)) {
                return edge;
            }
        }

        return undefined;
    }

    public addEdge(source: Identifier, target: Identifier, data: EdgeData, options?: GraphEdgeOptions): GraphEdge<Identifier, EdgeData, NodeData> | undefined {
        const sourceNode = this.getNode(source);
        const targetNode = this.getNode(target);

        if (!sourceNode || !targetNode) {
            return undefined;
        }

        const edge = new GraphEdge<Identifier, EdgeData, NodeData>(sourceNode, targetNode, data, options);
        if (this.hasEdge(edge)) {
            return undefined;
        }

        sourceNode.addEdge(edge);
        targetNode.addEdge(edge);

        this.edges.push(edge);

        return edge;
    }

    public hasEdge(sourceOrEdge: Identifier | GraphEdge<Identifier, EdgeData, NodeData>, target?: Identifier): boolean {
        if (sourceOrEdge instanceof GraphEdge) {
            return this.edges.includes(sourceOrEdge);
        }

        if (!target) {
            return false;
        }

        return !!this.getEdge(sourceOrEdge, target);
    }

    public removeEdge(sourceOrEdge: Identifier | GraphEdge<Identifier, EdgeData, NodeData>, target?: Identifier): boolean {
        if (sourceOrEdge instanceof GraphEdge) {
            sourceOrEdge.delete();
            this.edges.splice(this.edges.indexOf(sourceOrEdge), 1);

            return true;
        }

        if (target === undefined) {
            return false;
        }

        const edge = this.getEdge(sourceOrEdge, target);
        if (edge) {
            return this.removeEdge(edge);
        }

        return false;
    }

    //ROUTE
    private visitStacked(
        from: Identifier,
        callback: (node: GraphNode<Identifier, NodeData, EdgeData>, stack: ReadonlyArray<GraphNode<Identifier, NodeData, EdgeData>>, weight: number) => void,
    ): void {
        const fromNode = this.getNode(from);
        if (!fromNode) {
            throw new Error('Provided node isn\'t part of this graph.');
        }

        const stack: GraphNode<Identifier, NodeData, EdgeData>[] = [fromNode];
        let weight: number = 0;

        const iterator = (sourceNode: GraphNode<Identifier, NodeData, EdgeData>): void => {
            for (const edge of this.edges) {
                if (edge.target.id === sourceNode.id) {
                    continue;
                }

                const targetNode = edge.target;
                if (stack.filter(stackedNode => stackedNode.id === targetNode.id).length > 0) {
                    continue;
                }

                stack.push(targetNode);
                weight += edge.weight;

                callback(targetNode, stack, weight);

                iterator(targetNode);
                weight -= edge.weight;
                stack.pop();
            }
        };

        iterator(fromNode);
    }

    public getRoutes({from, to, where}: RouteFindQuery<Identifier>): GraphRoute<Identifier, NodeData, EdgeData>[] {
        const routes: GraphRoute<Identifier, NodeData, EdgeData>[] = [];

        if (!this.hasNode(from) || to && !this.hasNode(to)) {
            return routes;
        }

        this.visitStacked(from, (node, stack, weight) => {
            if (to && node.id !== to) {
                return;
            }

            if (where && where.length !== stack.length) {
                return;
            }

            // let whereCount: number = where.length; //TODO do we want this as a filter?
            // for (const node of stack) {
            //     if (where.includes(node.id)) {
            //         whereCount--;
            //     } else {
            //         return;
            //     }
            // }
            //
            // if (whereCount !== 0) {
            //     return;
            // }

            routes.push(new GraphRoute<Identifier, NodeData, EdgeData>(stack.slice(), weight));
        });

        return routes;
    }

    public findRoute(where: Identifier[]): GraphRoute<Identifier, NodeData, EdgeData> | undefined {
        if (where.length === 0) {
            return undefined;
        }

        const routes = this.getRoutes({
            from: where[0],
            where: {
                length: where.length
            }
        });

        for (const route of routes) {
            if (route.path.map(node => node.id).toString() === where.toString()) {
                return route;
            }
        }

        return undefined;
    }

    public hasRoute(route: GraphRoute<Identifier, NodeData, EdgeData>): boolean {
        const hasStart = this.hasNode(route.start);
        if (!hasStart) {
            return false;
        }

        const iterator = (source: GraphNode<Identifier, NodeData, EdgeData>, routeIndex: number): boolean => {
            let found: boolean = false;
            let nextNode: GraphNode<Identifier, NodeData, EdgeData> | undefined = undefined;

            for (const node of source.getReachableNodes()) {
                if (!node.equals(route.path[routeIndex])) {
                    continue;
                }

                nextNode = node;
                found = true;
                break;
            }

            if (!found || !nextNode) {
                return false;
            }

            if (routeIndex === route.path.length - 1) {
                return true;
            }

            return iterator(nextNode, ++routeIndex);
        };

        return iterator(route.start, 1);
    }

    //MISC
    public clear(): void {
        for (const edge of this.edges) {
            this.removeEdge(edge);
        }

        for (const [id] of this.nodes) {
            this.removeNode(id);
        }
    }
}