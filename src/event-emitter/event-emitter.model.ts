import type { EventCollection, EventEmitterInterface, Handler, ListenerOptions } from "./event-emitter.interface";

export type ListenerObject<events extends EventCollection, eventName extends keyof events> = {
    handler: Handler<EventEmitterInterface<events>, events[eventName]>;
    options?: Partial<ListenerOptions>;
    markedForRemoval: boolean;
}
export type ListenerCollection<events extends EventCollection> = {
    [eventName in keyof events]: ListenerObject<events, eventName>[]
};

export default class EventEmitter<events extends EventCollection> implements EventEmitterInterface<events> {
    private listeners: Partial<ListenerCollection<events>> = {};

    constructor() {
        
    }

    public addEventListener<e extends keyof events>(event: e, handler: Handler<EventEmitterInterface<events>, events[e]>, listenerOptions?: Partial<ListenerOptions>): this {
        const listeners = this.listeners[event] ?? [];

        listeners.push({
            handler,
            options: listenerOptions,
            markedForRemoval: false
        })
        return this;
    }

    public removeEventListener<e extends keyof events>(event: e, handler: Handler<EventEmitterInterface<events>, events[e]>, listenerOptions?: Partial<ListenerOptions>): this {
        this.listeners[event]
            ?.filter(listener =>
                listener.handler !== handler && listener.options !== listenerOptions
                )
            
        return this;
    }

    public emitEvent<e extends keyof events>(eventName: e, event: events[e], defaultBehavior?: (this: this) => void): this {
        this.listeners[eventName]
            ?.forEach(listener => {
                listener.handler.call(this, event);
                listener.markedForRemoval = (listener.options?.once === true)
            });
            
        this.listeners[eventName] = this.listeners[eventName]
            ?.filter(({ markedForRemoval}) => !markedForRemoval)
        
        if (!event.isCanceled) {
            defaultBehavior?.call(this);
        }

        return this;
    }

}