import { EventInterface, EventType, EVENT_PHASE } from "./event.interface";
import { EventListenerInterface } from "./listener.interface";

export type AddListenerOptions = {
    /**
     * Should the listener be removed after having been invoked once ?
     * Emulate the way native listeners behave.
     * 
     * @default false;
     */
    once?: boolean;
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
    passive?: boolean;
    /**
     * The listener will be removed when the given {@link AbortSignal} object's {@link AbortSignal.abort abort()} method is called.
     * If not specified, no AbortSignal is associated with the listener.
     */
    signal?: AbortSignal;
} & EventListenerOptions;

export type EventListenerOptions = {
    /**
     * When set to true, options’s capture prevents callback from being invoked when the event’s eventPhase attribute 
     * value is {@link EVENT_PHASE.BUBBLING_PHASE BUBBLING_PHASE}.  
     * When false (or not present), callback will not be invoked when event’s eventPhase attribute value is
     * {@link EVENT_PHASE.CAPTURING_PHASE CAPTURING_PHASE}.  
     * Either way, callback will be invoked if event’s eventPhase attribute value is {@link EVENT_PHASE.AT_TARGET AT_TARGET}. 
     */
    capture?: boolean;
}

export type EventCollection = {
    [eventType in EventType]: EventInterface<eventType>
}

export type Handler<E extends EventInterface> = EventListenerInterface<E> | null;

export interface EventTargetInterface<Events extends EventCollection = EventCollection> {
    /**
     * Add an event listener
     * @param event A case-sensitive string representing the event type to listen for.
     * @param listener The object that receives a notification (an object that implements the Event interface)
     * when an event of the specified type occurs. This must be null, an object with a handleEvent() method,
     * or a JavaScript function. See The event listener callback for details on the callback itself. 
     * @param options An object that specifies characteristics about the event listener. See {@link AddListenerOptions} for details on the available options.
     */
    addEventListener<EventName extends (Exclude<keyof Events, number | symbol>)>(event: EventName, listener: Handler<Events[EventName]>, options?: Partial<AddListenerOptions> | boolean): void;
    /**
     * Remove an existing event listener
     * @param event A string which specifies the type of event for which to remove an event listener.
     * @param handler The event listener function of the event handler to remove from the event target.
     */
    removeEventListener<EventName extends (Exclude<keyof Events, number | symbol>)>(event: EventName, handler: Handler<Events[EventName]>, options?: Partial<EventListenerOptions> | boolean): void;
    /**
     * Emit an event for listeners to handler.
     * @param event A fully initialized Event object that will be passed to listeners.
     * 
     * @throws {DOMException} InvalidStateError : the event you are trying to dispatch has already been dispatched or is not initialized.
     */
    dispatchEvent<EventName extends (Exclude<keyof Events, number | symbol>)>(event: Events[EventName]): boolean;
}