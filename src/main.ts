import './style.css';
import {Color, Engine} from "excalibur";
import {DungeonScene} from "./Excalibur/Scene/DungeonScene.ts";

const height = 25;
const width = 25;

const engine = new Engine({
    maxFps: 60,
    backgroundColor: Color.Black,
});

engine.addScene('dungeon', new DungeonScene({height, width}));

await engine.start();

await engine.goToScene('dungeon');
