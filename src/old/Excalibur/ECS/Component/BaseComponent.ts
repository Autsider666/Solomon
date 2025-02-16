import {Component} from "excalibur";
import {BaseActor} from "../../Actor/BaseActor.ts";

export abstract class BaseComponent extends Component {
    declare owner?: BaseActor;

    onAdd?(owner: BaseActor): void;
}