import { AddListenerOptions, EventCollection, EventListenerOptions, EventTargetInterface, Handler } from "../../API/event-target.interface";
import { EventInterface, EventType } from "../../API/event.interface";
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
    private static getDefaultPassiveValue<events extends EventCollection>(_type: EventType, _eventTarget: EventTarget<events>): boolean {
        return false;
    };

    private eventListenerList: ListernerInterface<Events[keyof Events]>[] = [];

    constructor() {}

    private static addAnEventListener<events extends EventCollection>(target: EventTarget<events>, listener: ListernerInterface<events[keyof events]>): void {
        if (listener.signal !== null && listener.signal.aborted) {
            return;
        }

        if (listener.callback === null) {
            return;
        }

        listener.passive ??= this.getDefaultPassiveValue(listener.type, target);

        const noExistingListernerIsSimilar = target.eventListenerList.every(existingListener => 
            existingListener.type !== listener.type &&
            existingListener.callback !== listener.callback && 
            existingListener.capture !== listener.capture
        );
        if (noExistingListernerIsSimilar) {
            target.eventListenerList.push(listener);
        }

        if (listener.signal !== null) {
            listener.signal.addEventListener('abort', () => this.removeAnEventListener(target, listener));
        }
    }

    public addEventListener<EventName extends (Exclude<keyof Events, number | symbol>)>(type: EventName, callback: Handler<Events[EventName]> = null, options: AddListenerOptions | boolean = {}): void {
        const {capture, passive, once, signal} = EventTarget.flattenMoreOptions(options);
        EventTarget.addAnEventListener(this, {
            type,
            callback,
            capture,
            passive,
            once,
            signal,
            removed: false
        })
    }

    private static removeAnEventListener<events extends EventCollection>(target: EventTarget<events>, listener: ListernerInterface<events[keyof events]>): void {
        listener.removed = true;
        target.eventListenerList = target
            .eventListenerList
            .filter(existingListener => existingListener === listener);
    }

    private static removeAllEventListener(target: EventTarget<EventCollection>): void {
        target.eventListenerList
            .forEach(listener => this.removeAnEventListener(target, listener));
    }

    public removeEventListener<EventName extends (keyof Events)>(type: EventName, callback: Handler<Events[EventName]>, options: EventListenerOptions | boolean = {}): void {
        const capture = EventTarget.flattenOptions(options);

        const listener = this.eventListenerList.find(listener => 
            listener.type == type &&
            listener.callback == callback && 
            listener.capture == capture
        );
        if (typeof listener !== "undefined") {
            EventTarget.removeAnEventListener(this, listener);
        }
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

    private static flattenOptions(options: EventListenerOptions | boolean): FlattenedOptions {
        if (typeof options === 'boolean') {
            return options;
        }

        return options.capture ?? false;
    }

    private static flattenMoreOptions(options: AddListenerOptions | boolean): FlattenedMoreOptions {
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