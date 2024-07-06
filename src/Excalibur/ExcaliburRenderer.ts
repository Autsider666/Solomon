import {Color, DefaultLoader, DisplayMode, Engine} from "excalibur";
import {ImageSourceContent} from "../Content/Graphic/ImageSourceContent.ts";
import {GraphScene} from "./GraphScene.ts";
import {ScreenData, ScreenScene} from "./ScreenScene.ts";

export class ExcaliburRenderer {
    private readonly loader: DefaultLoader;
    private readonly engine: Engine<'screen' | 'graph'>;

    constructor() {
        this.engine = new Engine<'screen' | 'graph'>({
            backgroundColor: Color.Black,
            scenes: {
                screen: new ScreenScene(),
                graph: new GraphScene(),
            },
            displayMode: DisplayMode.FillScreen,
        });
        this.loader = new DefaultLoader();
        ImageSourceContent.bindLoader(this.loader);
    }

    async start(): Promise<void> {
        return this.engine.start(this.loader);
    }

    async loadLevel(data: ScreenData): Promise<void> {
        await this.engine.goToScene('screen', {sceneActivationData: data});
    }

    async generateDungeon(): Promise<void> {
        await this.engine.goToScene('graph');
    }
}