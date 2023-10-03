import { AddListenerOptions, EventCollection, EventListenerOptions, EventTargetInterface, Handler } from "../../API/event-target.interface";
import { EventInterface } from "../../API/event.interface";
import { ListernerInterface } from "../../API/listener.interface";

export type FlattenedOptions = boolean;
export type FlattenedMoreOptions = {
    capture: FlattenedOptions,
    passive: boolean | null,
    once: boolean,
    signal: AbortSignal | null
}

export default class EventTarget<Events extends EventCollection> implements EventTargetInterface<Events> {
    /**
     * The spec's definition is a bit more complexe, but for the purpose of this lib it can be simplified to that.
     * 
     * @see https://dom.spec.whatwg.org/#default-passive-value
     */
    private readonly defaultPassiveValue = false;

    private eventListenerList: ListernerInterface<Events[keyof Events]>[] = [];

    constructor() {}

    public addEventListener<EventName extends (keyof Events)>(event: EventName, listener: Handler<Events[EventName]>, options?: AddListenerOptions | boolean): void {
        throw new Error("Method not implemented.");
    }
    public removeEventListener<EventName extends (keyof Events)>(event: EventName, handler: Handler<Events[EventName]>, options?: EventListenerOptions | boolean): void {
        throw new Error("Method not implemented.");
    }
    public dispatchEvent<EventName extends (keyof Events)>(event: Events[EventName]): boolean {
        throw new Error("Method not implemented.");
    }

    protected getParent(): EventTargetInterface | null {
        return null;
    }

    protected activationBehavior(event: EventInterface<Exclude<keyof Events, number | symbol>>): void {
        // no-op
        event = event;
    }

    private flattenOptions(options: EventListenerOptions | boolean): FlattenedOptions {
        if (typeof options === 'boolean') {
            return options;
        }

        return options.capture ?? false;
    }

    private flattenMoreOptions(options: AddListenerOptions | boolean): FlattenedMoreOptions {
        const capture = this.flattenOptions(options);
        let once = false;
        let passive = null;
        let signal = null;
        
        if (options !== null && typeof options === 'object') {
            once = options.once ?? once;
            passive = options.passive ?? passive;
            signal = options.signal ?? signal;
        }

        return {
            capture,
            once,
            passive,
            signal
        };

    }
}