import { EventInterface } from "./event.interface";

export type Handler<eventPayload extends any> = (event: EventInterface<eventPayload>) => void;

export type EventCollection<EventPayloads extends Record<string, any>> = {
    [eventName in keyof EventPayloads]: EventInterface<EventPayloads[eventName]>;
};

export type ListenerOptions = {
    /**
     * Should the listener be removed after having been invoked once ?
     * Emulate the way native listeners behave.
     */
    once: boolean;
}

export type EventsFromEmitter<Events> = Events extends EventEmitterInterface<infer X> ? X : never


export interface EventEmitterInterface<events extends Record<string, any> = Record<string, any>> {
    /**
     * Add an event listener
     */
    addEventListener<e extends (keyof events)|string>(event: e, handler: Handler<events[e]>, listenerOptions?: Partial<ListenerOptions>): this;
    /**
     * Remove an existing event listener
     */
    removeEventListener<e extends (keyof events)|string>(event: e, handler: Handler<events[e]>, listenerOptions?: Partial<ListenerOptions>): this;
    /**
     * Emit an event for listeners to handler.
     * @param eventName Name of the event to emit.
     * @param event An event object that will be concecutively passed to the handlers and that can hold information.
     */
    emitEvent<e extends (keyof events)|string>(eventName: e, event: events[e]): this;
    /**
     * Emit an event for listeners to handler.
     * @param eventName Name of the event to emit.
     * @param event An event object that will be concecutively passed to the handlers and that can hold information.
     * @param defaultBehavior The default behavior of the emiter when the emited event happens, this callback is call once all event handlers have been called and if none call {@link EventInterface.preventDefault preventDefault}
     */
    emitEvent<e extends (keyof events)|string>(eventName: e, event: events[e], defaultBehavior?: (this: this) => void): this;
}
