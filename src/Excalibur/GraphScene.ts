import {Actor, Circle, Color, Engine, Keys, Raster, Rectangle, Scene, Vector} from "excalibur";
import Graph from "graphology";
import {allSimplePaths} from "graphology-simple-path";
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
    private dirty: boolean = true;
    private readonly nodeSize: number = 25;
    private readonly nodePadding: number = 50;
    private readonly edgeWidth: number = 15;
    private readonly graphDimensions: Dimensions = {
        width: 6,
        height: 6,
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

        this.graphKeys.iterateAll((source, sourceCoordinate) => {
            const origin = sourceCoordinate.toString() + ' -> ';

            if (sourceCoordinate.x > 0) {
                const targetCoordinate = sourceCoordinate.inDirection(Direction.west);
                const edge = origin + targetCoordinate.toString();
                const target = this.graphKeys.get(targetCoordinate);
                if (!this.graph.hasEdge(source, target)) {
                    this.graph.addUndirectedEdgeWithKey(
                        edge,
                        source,
                        target,
                        {active: false},
                    );
                }
            }

            if (sourceCoordinate.x < this.graphDimensions.width - 1) {
                const targetCoordinate = sourceCoordinate.inDirection(Direction.east);
                const edge = origin + targetCoordinate.toString();
                const target = this.graphKeys.get(targetCoordinate);
                if (!this.graph.hasEdge(source, target)) {
                    this.graph.addUndirectedEdgeWithKey(
                        edge,
                        source,
                        target,
                        {active: false},
                    );
                }
            }

            if (sourceCoordinate.y > 0) {
                const targetCoordinate = sourceCoordinate.inDirection(Direction.north);
                const edge = origin + targetCoordinate.toString();
                const target = this.graphKeys.get(targetCoordinate);
                if (!this.graph.hasEdge(source, target)) {
                    this.graph.addUndirectedEdgeWithKey(
                        edge,
                        source,
                        target,
                        {active: false},
                    );
                }
            }

            if (sourceCoordinate.y < this.graphDimensions.height - 1) {
                const targetCoordinate = sourceCoordinate.inDirection(Direction.south);
                const edge = origin + targetCoordinate.toString();
                const target = this.graphKeys.get(targetCoordinate);
                if (!this.graph.hasEdge(source, target)) {
                    this.graph.addUndirectedEdgeWithKey(
                        edge,
                        source,
                        target,
                        {active: false},
                    );
                }
            }
        });

        this.generate();
    }

    private generate(): void {
        this.graph.forEachEdge((_, data) => {
            data.active = false;
        });

        this.graph.forEachNode((_, data) => {
            data.tags.length = 0;
        });

        this.dirty = true;
        let totalTries: number = 10;
        while (totalTries > 0) {
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

            let firstPath: string[] = [];
            let secondPath: string[] = [];
            let pathingTries: number = 100;
            const avgDistance = Math.sqrt(this.graphDimensions.height * this.graphDimensions.width);
            const paths = allSimplePaths(this.graph, start, goal, {maxDepth: 1.5 * avgDistance});
            // .filter(path => path.length >= Math.round(avgDistance * 0.5));
            while (pathingTries > 0 && secondPath.length === 0) {
                firstPath = this.getPathBetween(Random.shuffle(paths), avgDistance);
                const excludedGraph = this.graph.copy();
                for (const node of firstPath) {
                    if (excludedGraph.hasNode(node) && node !== start.toString() && node !== goal.toString()) {
                        excludedGraph.dropNode(node);
                    }
                }
                secondPath = this.getPathBetween(
                    Random.shuffle(allSimplePaths(excludedGraph, start, goal, {maxDepth: 2 * avgDistance})),
                    Math.round(avgDistance),
                );
                pathingTries--;
            }

            if (secondPath.length === 0) {
                this.graph.getNodeAttributes(start).tags = [];
                this.graph.getNodeAttributes(goal).tags = [];
                totalTries--;
            } else {
                this.activatePath(firstPath);
                this.activatePath(secondPath);
                break;
            }
        }
    }

    private getPathBetween(paths: string[][], minDistance: number = 0): string[] {
        for (const path of paths) {
            if (path.length < minDistance) {
                continue;
            }

            return path;
        }

        return [];
    }

    private activatePath(path: string[]): void {
        for (let i = 0; i < path.length; i++) {
            const source = path[i];
            const target = path[i + 1];
            if (!target) {
                continue;
            }


            this.graph.getNodeAttributes(source).tags.push("active");
            this.graph.getNodeAttributes(target).tags.push("active");

            this.graph.getEdgeAttributes(source, target).active = true;
        }
    }

    onPreUpdate() {
        if (!this.dirty) {
            return;
        }

        this.dirty = false;
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

                this.graphicsMap.set(nodeData, nodeGraphic);

                this.add(actor);
            }

            let color: Color = Color.DarkGray;
            if (nodeData.tags.includes('start')) {
                color = Color.Green;
            } else if (nodeData.tags.includes('goal')) {
                color = Color.Red;
            } else if (nodeData.tags.includes('active')) {
                color = Color.Orange;
            }


            nodeGraphic.strokeColor = nodeData.tags.includes('active') ? Color.Orange : Color.Transparent;
            nodeGraphic.lineWidth = 2;

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

                    this.graphicsMap.set(edge, edgeGraphic);
                }

                edgeGraphic.color = edgeData.active ? Color.Yellow : Color.DarkGray;

                handled.add(edge);
            });
        });
    }

    onInitialize(engine: Engine) {
        engine.inputMapper.on(({keyboard}) => keyboard.wasPressed(Keys.R), () => this.generate());
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