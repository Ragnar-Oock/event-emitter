import type { EventInterface, EventType } from "./event.interface";

export type HandlerFunction<type extends EventType, eventPayload> = (event: EventInterface<type,eventPayload>) => void;
export type Handler<type extends EventType, eventPayload> = HandlerFunction<type, eventPayload> | null;


export type ListenerOptions<Passive extends boolean = boolean, Once extends boolean = boolean> = {
    /**
     * Should the listener be removed after having been invoked once ?
     * Emulate the way native listeners behave.
     */
    once: Once;

    /**
     * Make the listener passive, i.e. unable to cancel the default behavior of the event it recieves.
     * Much like the native events this can be used to prevent jank or latancy if the listner's handler takes too long to process the event.
     * 
     * The event's default behavior can be executed before or while the listener is called instead of after for non-passive listeners.
     * 
     * The value of this property does not impact that of the Event's {@link EventInterface.cancelable cancelable} property as other listeners might be registerer to that event as non-passive.
     * 
     * @default false
     */
    passive: Passive;

    /**
     * The listener will be removed when the given {@link AbortSignal} object's {@link AbortSignal.abort abort()} method is called.
     * If not specified, no AbortSignal is associated with the listener.
     */
    signal: AbortSignal;
}

export type RemoveListernerOptions = Partial<Record<string, never>> | boolean;

export type EventsFromEmitter<Events> = Events extends EventEmitterInterface<infer X> ? X : never;


export interface EventEmitterInterface<events extends Record<EventType, any> = Record<EventType, any>> {
    /**
     * Add an event listener
     * @param event A case-sensitive string representing the event type to listen for.
     * @param listener The object that receives a notification (an object that implements the Event interface)
     * when an event of the specified type occurs. This must be null, an object with a handleEvent() method,
     * or a JavaScript function. See The event listener callback for details on the callback itself. 
     * @param options An object that specifies characteristics about the event listener. See {@link ListenerOptions} for details on the available options.
     */
    addEventListener<EventName extends (keyof events)>(event: EventName, listener: Handler<EventName, events[EventName]>, options?: Partial<ListenerOptions>): this;
    /**
     * Remove an existing event listener
     * @param event A string which specifies the type of event for which to remove an event listener.
     * @param handler The event listener function of the event handler to remove from the event target.
     */
    removeEventListener<EventName extends (keyof events)>(event: EventName, handler: Handler<EventName, events[EventName]>): this;
    /**
     * Emit an event for listeners to handler.
     * @param eventName Name of the event to emit.
     * @param event A fully initialized Event object that will be passed to listeners.
     */
    dispatchEvent<EventName extends (keyof events)>(event: EventInterface<EventName, events[EventName]>): Promise<this>;
    /**
     * Emit an event for listeners to handler.
     * @param eventName Name of the event to emit.
     * @param event A fully initialized Event object that will be passed to listeners.
     * @param defaultBehavior The default behavior of the emiter when the emited event happens, this callback is call once all event handlers have been called and if none call {@link EventInterface.preventDefault preventDefault}
     */
    dispatchEvent<EventName extends (keyof events)>(event: EventInterface<EventName, events[EventName]>, defaultBehavior?: (this: this) => void): Promise<this>;
}
