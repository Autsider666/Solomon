import {Actor, Circle, Color, Raster, Rectangle, Scene, Vector} from "excalibur";
import {Array2D} from "../Utility/Array2D.ts";
import {Dimensions} from "../Utility/Geometry/Dimensions.ts";
import {Direction} from "../Utility/Geometry/Direction.ts";
import {Coordinate} from "../Utility/Geometry/Shape/Coordinate.ts";
import {Graph} from "../Utility/Graph/Graph.ts";
import {Random} from "../Utility/Random.ts";

type NodeTag = 'start' | `goal` | 'active';

type NodeData = {
    grid: Coordinate,
    position: Vector
    tags: NodeTag[],
}


type EdgeData = {
    active: boolean
}

export class GraphScene extends Scene {
    private readonly nodeSize: number = 25;
    private readonly nodePadding: number = 50;
    private readonly edgeWidth: number = 10;
    private readonly graphDimensions: Dimensions = {
        width: 3,
        height: 3,
    };
    private readonly graphicsMap: Map<unknown, Raster> = new Map<unknown, Raster>();
    private readonly graphKeys: Array2D<Vector>;
    private readonly graph: Graph<Vector, NodeData, EdgeData> = new Graph<Vector, NodeData, EdgeData>();

    constructor() {
        super();

        this.graphKeys = Array2D.generate(
            this.graphDimensions,
            ({x, y}) => {
                const key = new Vector(x * this.nodeSize + ((x + 1) * this.nodePadding), y * this.nodeSize + ((y + 1) * this.nodePadding));
                this.graph.addNode(key, {
                    position: key,
                    tags: [],
                    grid: new Coordinate(x, y),
                });

                return key;
            },
        );

        this.graphKeys.iterateAll((key, coordinate) => {
            if (coordinate.x > 0) {
                this.graph.addEdge(key, this.graphKeys.get(coordinate.inDirection(Direction.west)), {active: false});
            }

            if (coordinate.x < this.graphDimensions.width - 1) {
                this.graph.addEdge(key, this.graphKeys.get(coordinate.inDirection(Direction.east)), {active: false});
            }

            if (coordinate.y > 0) {
                this.graph.addEdge(key, this.graphKeys.get(coordinate.inDirection(Direction.north)), {active: false});
            }

            if (coordinate.y < this.graphDimensions.height - 1) {
                this.graph.addEdge(key, this.graphKeys.get(coordinate.inDirection(Direction.south)), {active: false});
            }
        });

        let startTries = 10;
        let start: Vector | undefined;
        while (startTries > 0) {
            startTries--;
            const node = this.getRandomNode();
            if (node && node.data.tags.length === 0) {
                node.data.tags.push('start');
                start = node.id;
                break;
            }
        }

        let goalTries = 10;
        let goal: Vector | undefined;
        while (goalTries > 0) {
            goalTries--;
            const node = this.getRandomNode();
            if (node && node.data.tags.length === 0) {
                node.data.tags.push('goal');
                goal = node.id;
                break;
            }
        }

        if (!start || !goal) {
            throw new Error('No start or goal found');
        }

        // const route = this.graph.getRoutes({
        //     from: start,
        //     to: goal,
        // });
        // console.log(route);

        // let found: boolean = false;
        // BreadthFirstSearch.search(this.graph, start, (path, distance) => {
        //     console.log(path.map(node => node.data.grid.toString()), distance);
        //
        //     if (!found && path.filter(node => node.id === goal).length > 0) {
        //         const startNode = this.graph.getNode(start);
        //         if (!startNode) {
        //             throw new Error('sdasdasd');
        //         }
        //
        //         const route = [startNode, ...path];
        //         for (let i = 0; i < route.length; i++) {
        //             const source = route[i];
        //             const target = route[i + 1];
        //             if (!target) {
        //                 continue;
        //             }
        //
        //             for (const edge of source.getEdges()) {
        //                 if (edge.source.equals(target) || edge.target.equals(target)) {
        //                     edge.data.active = true;
        //                 }
        //             }
        //
        //             source.data.tags.push('active');
        //             target.data.tags.push('active');
        //         }
        //
        //         found = true;
        //     }
        // });

        // const routes = this.graph.getRoutes({
        //     from: start,
        //     to: goal,
        //     // where: {
        //     //     length: 6,
        //     // }
        // });
        //
        // console.log(routes);
    }

    onActivate() {
        const handled = new Set<unknown>();

        this.graphKeys.iterateAll((key) => {
            const node = this.graph.getNode(key);
            if (!node) {
                throw new Error('No node available for this key.');
            }

            let nodeGraphic: Raster | undefined = this.graphicsMap.get(node);
            if (!nodeGraphic) {
                const actor = new Actor({
                    pos: key,
                });

                nodeGraphic = new Circle({
                    radius: this.nodeSize,
                    color: Color.White,
                    // lineWidth: 2,
                    // strokeColor: Color.Gray,
                });

                actor.graphics.use(nodeGraphic);

                this.add(actor);
            }

            let color: Color = Color.DarkGray;
            if (node.data.tags.includes('start')) {
                color = Color.Green;
            } else if (node.data.tags.includes('goal')) {
                color = Color.Red;
            }
            if (node.data.tags.includes('active')) {
                color = Color.White;
            }

            nodeGraphic.color = color;

            for (const edge of node.getEdges() ?? []) {
                if (handled.has(edge)) {
                    continue;
                }

                const horizontal = edge.source.data.position.x !== edge.target.data.position.x;

                let edgeGraphic: Raster | undefined = this.graphicsMap.get(edge);
                if (!edgeGraphic) {
                    const actor = new Actor({
                        pos: key,
                        anchor: !horizontal ? new Vector(0.5, 0) : new Vector(0, 0.5),
                    });

                    actor.z = -10;

                    edgeGraphic = new Rectangle({
                        height: horizontal ? this.edgeWidth : this.nodePadding + this.nodeSize,
                        width: !horizontal ? this.edgeWidth : this.nodePadding + this.nodeSize,
                        color: Color.White,
                        // lineWidth: 2,
                        // strokeColor: Color.Gray,
                    });

                    actor.graphics.use(edgeGraphic);
                    this.add(actor);
                }

                edgeGraphic.color = edge.data.active ? Color.White : Color.DarkGray;

                handled.add(edge);
            }
        });
    }

    private getNode(coordinate: Coordinate) {
        return this.graph.getNode(this.graphKeys.get(coordinate));
    }

    private getRandomNode() {
        return this.getNode(Coordinate.create(
            Random.range(0, this.graphDimensions.width - 1),
            Random.range(0, this.graphDimensions.height - 1),
        ));
    }
}