import {Loader, LoaderOptions} from "excalibur";
import {Images} from "./Images.ts";

export class RoguelikeLoader extends Loader {
    constructor(options?: LoaderOptions) {
        super(options);

        Images.load(this);
    }
}