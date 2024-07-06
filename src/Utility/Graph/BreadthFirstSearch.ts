import {Queue} from "../Queue.ts";
import {Graph} from "./Graph.ts";
import {GraphNode} from "./GraphNode.ts";

export class BreadthFirstSearch {
    static search<Identifier, Data>(
        graph: Graph<Identifier, Data>,
        start: GraphNode<Identifier, Data> | Identifier,
        callback: (path: ReadonlyArray<GraphNode<Identifier, Data>>, distance: number) => void,
    ): void {
        const startNode: GraphNode<Identifier, Data> | undefined = start instanceof GraphNode ? start : graph.getNode(start);

        if (!startNode) {
            throw new Error('The given start node is not part of t his graph');
        }

        const queue = new Queue<GraphNode<Identifier, Data>[]>();
        const visitedNodes = new Set<GraphNode<Identifier, Data>>();
        let distance: number = 0;

        queue.enqueue([startNode]);
        visitedNodes.add(startNode);

        while (!queue.isEmpty()) {
            const level = queue.dequeue() ?? [];
            const adjacentNodes: GraphNode<Identifier, Data>[] = [];
            for (const levelNode of level) {
                for (const node of levelNode.getReachableNodes()) {
                    if (visitedNodes.has(node)) {
                        continue;
                    }

                    adjacentNodes.push(node);
                    visitedNodes.add(node);
                }

                queue.enqueue(adjacentNodes); //TODO [...adjacentNodes] needed?
            }

            if (adjacentNodes.length === 0) {
                continue;
            }

            callback(adjacentNodes, ++distance);
        }
    }
}