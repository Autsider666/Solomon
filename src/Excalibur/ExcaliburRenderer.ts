import {Color, DefaultLoader, Engine} from "excalibur";
import {ImageSourceContent} from "../Content/Graphic/ImageSourceContent.ts";
import {Screen, ScreenData} from "./Screen.ts";

export class ExcaliburRenderer {
    private readonly loader: DefaultLoader;
    private readonly engine: Engine<'screen'>;

    constructor() {
        this.engine = new Engine<'screen'>({
            backgroundColor: Color.Black,
            scenes: {screen: new Screen()},
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
}