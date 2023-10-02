import { EventInterface } from "./event.interface";

export interface EventListenerInterface<E extends EventInterface> {
    handleEvent(event: E): void;
}

export interface ListernerInterface<E extends EventInterface> {
    /**
     * Identifier of the event the listener needs to react to
     */
    type: E['type'];
    /**
     * the hanlder to call when the event is dispatched
     */
    callback: EventListenerInterface<E> | null;
    /**
     * is the listener passive ?
     */
    passive: boolean | null;
    /**
     * should the listener be removed after one call
     */
    once: boolean;
    /**
     * An abort signal to remove the listener remotly
     */
    signal: AbortSignal | null;
    /**
     * an internal flag for book keeping purpose
     * @internal
     */
    removed: boolean;
}