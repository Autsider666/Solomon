import {Actor, Circle, Color, Raster, Rectangle, Scene, Vector} from "excalibur";
import Graph from "graphology";
import {Array2D} from "../Utility/Array2D.ts";
import {Dimensions} from "../Utility/Geometry/Dimensions.ts";
import {Direction} from "../Utility/Geometry/Direction.ts";
import {Coordinate} from "../Utility/Geometry/Shape/Coordinate.ts";
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
    private readonly graph: Graph<NodeData, EdgeData> = new Graph<NodeData, EdgeData>();

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

        this.graphKeys.iterateAll((key, sourceCoordinate) => {
            const origin = sourceCoordinate.toString() + ' -> ';

            if (sourceCoordinate.x > 0) {
                const targetCoordinate = sourceCoordinate.inDirection(Direction.west);
                this.graph.addEdgeWithKey(
                    origin + targetCoordinate.toString(),
                    key,
                    this.graphKeys.get(targetCoordinate),
                    {active: false},
                );
            }

            if (sourceCoordinate.x < this.graphDimensions.width - 1) {
                const targetCoordinate = sourceCoordinate.inDirection(Direction.east);
                this.graph.addEdgeWithKey(
                    origin + targetCoordinate.toString(),
                    key,
                    this.graphKeys.get(targetCoordinate),
                    {active: false},
                );
            }

            if (sourceCoordinate.y > 0) {
                const targetCoordinate = sourceCoordinate.inDirection(Direction.north);
                this.graph.addEdgeWithKey(
                    origin + targetCoordinate.toString(),
                    key,
                    this.graphKeys.get(targetCoordinate),
                    {active: false},
                );
            }

            if (sourceCoordinate.y < this.graphDimensions.height - 1) {
                const targetCoordinate = sourceCoordinate.inDirection(Direction.south);
                this.graph.addEdgeWithKey(
                    origin + targetCoordinate.toString(),
                    key,
                    this.graphKeys.get(targetCoordinate),
                    {active: false},
                );
            }
        });

        let startTries = 10;
        let start: Vector | undefined;
        while (startTries > 0) {
            startTries--;
            const node = this.getRandomNode();
            if (node && node.tags.length === 0) {
                node.tags.push('start');
                start = node.position;
                break;
            }
        }

        let goalTries = 10;
        let goal: Vector | undefined;
        while (goalTries > 0) {
            goalTries--;
            const node = this.getRandomNode();
            if (node && node.tags.length === 0) {
                node.tags.push('goal');
                goal = node.position;
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
            const nodeData = this.graph.getNodeAttributes(key);
            if (!nodeData) {
                throw new Error('No node available for this key.');
            }

            let nodeGraphic: Raster | undefined = this.graphicsMap.get(nodeData);
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
            if (nodeData.tags.includes('start')) {
                color = Color.Green;
            } else if (nodeData.tags.includes('goal')) {
                color = Color.Red;
            }
            if (nodeData.tags.includes('active')) {
                color = Color.White;
            }

            nodeGraphic.color = color;

            this.graph.forEachEdge(nodeData.position, (edge, edgeData, source, target) => {
                if (handled.has(edge)) {
                    return;
                }

                const sourceData = this.graph.getNodeAttributes(source);
                const targetData = this.graph.getNodeAttributes(target);

                const horizontal = sourceData.position.x !== targetData.position.x;

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

                edgeGraphic.color = edgeData.active ? Color.White : Color.DarkGray;

                handled.add(edge);
            });
        });
    }

    private getNode(coordinate: Coordinate) {
        return this.graph.getNodeAttributes(this.graphKeys.get(coordinate));
    }

    private getRandomNode() {
        return this.getNode(Coordinate.create(
            Random.range(0, this.graphDimensions.width - 1),
            Random.range(0, this.graphDimensions.height - 1),
        ));
    }
}