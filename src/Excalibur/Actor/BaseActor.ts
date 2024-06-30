import {Actor, EventEmitter, EventKey, Handler, Subscription} from "excalibur";
// @ts-expect-error PR to fix this is submitted
import {ActorEvents} from "excalibur/build/dist/Actor";
import {GridLayer} from "../types.ts";
import {TileGrid} from "../Utility/Tile/TileGrid.ts";

type Events = {
    lighting: {
        grid: TileGrid<GridLayer>,
    }
} & ActorEvents;

export class BaseActor extends Actor {
    events = new EventEmitter<Events>();

    on<TEventName extends EventKey<Events>>(eventName: TEventName, handler: Handler<Events[TEventName]>): Subscription {
        return super.on(eventName as EventKey<ActorEvents>, handler as Handler<ActorEvents[EventKey<ActorEvents>]>);
    }

    emit<TEventName extends EventKey<Events>>(eventName: TEventName, event: Events[TEventName]): void {
        super.emit(eventName, event);
    }
}