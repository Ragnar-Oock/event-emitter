import { EventTargetInterface } from "./event-target.interface";
import { EventInit, EventInterface, EventType } from "./event.interface";

export interface CustomEventInterface<
    EventName extends EventType = EventType,
    Target extends EventTargetInterface = EventTargetInterface,
    CurrentTarget extends EventTargetInterface = EventTargetInterface,
    Detail = any
    > extends EventInterface<EventName, Target, CurrentTarget> {

    readonly detail: Detail | null;

    /**
     * @deprecated use the CustomEvent constructor instead.
     * @param type name of the event to initialize
     * @param bubbles does the event bubble ?
     * @param cancelable can the event be canceled ?
     * @param detail the value for the {@link detail} property.
     */
    initCustomEvent(type: EventName, bubbles?: boolean, cancelable?: boolean, detail?: Detail): void;
}

export type CustomEventInit<Detail = any> = {
    /**
     * The value for the {@link CustomEventInterface.detail detail} property.
     * 
     * @default null;
     */
    detail?: Detail;
} & EventInit;