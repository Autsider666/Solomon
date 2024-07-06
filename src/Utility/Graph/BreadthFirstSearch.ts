import {Queue} from "../Queue.ts";
import {Graph} from "./Graph.ts";
import {GraphNode} from "./GraphNode.ts";

export class BreadthFirstSearch {
    static search<Identifier, NodeData, EdgeData>(
        graph: Graph<Identifier, NodeData, EdgeData>,
        start: GraphNode<Identifier, NodeData, EdgeData> | Identifier,
        callback: (path: ReadonlyArray<GraphNode<Identifier, NodeData, EdgeData>>, distance: number) => void,
    ): void {
        const startNode: GraphNode<Identifier, NodeData, EdgeData> | undefined = start instanceof GraphNode ? start : graph.getNode(start);

        if (!startNode) {
            throw new Error('The given start node is not part of t his graph');
        }

        const queue = new Queue<GraphNode<Identifier, NodeData, EdgeData>[]>();
        const visitedNodes = new Set<GraphNode<Identifier, NodeData, EdgeData>>();
        let distance: number = 0;

        const path: GraphNode<Identifier, NodeData, EdgeData>[] = [startNode];

        queue.enqueue([...path]);
        callback([...path], distance);
        visitedNodes.add(startNode);

        while (!queue.isEmpty()) {
            const level = queue.dequeue() ?? [];
            path.length = 0;
            // const adjacentNodes: GraphNode<Identifier, NodeData, EdgeData>[] = [];
            for (const levelNode of level) {
                for (const node of levelNode.getReachableNodes()) {
                    if (visitedNodes.has(node)) {
                        continue;
                    }

                    path.push(node);
                    visitedNodes.add(node);
                }

                queue.enqueue([...path]); //TODO [...adjacentNodes] needed?
            }

            if (path.length === 0) {
                continue;
            }

            callback([...path], ++distance);
        }
    }
}