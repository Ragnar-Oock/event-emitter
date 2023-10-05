import { EventTargetInterface } from "./event-target.interface";
import { SequenceInterface } from "./sequence.interface";

/**
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase}
 */
export enum EVENT_PHASE {
    /**
     * The event is not being processed at this time.
     */
    NONE = 0,
    /**
     * The event is being propagated through the target's ancestor objects. 
     * 
     * Currently not implemented.
     */
    CAPTURING_PHASE = 1,
    /**
     * The event has arrived at the event's target. Event listeners registered for this phase are called at this time.
     */
    AT_TARGET = 2,
    /**
     * The event is propagating back up through the target's ancestors in reverse order, starting with the parent. 
     * 
     * Currently not implemented.
     */
    BUBBLING_PHASE = 3,
}

export type EventType = string;

export interface EventInterface<
    EventName extends EventType = EventType,
    Target extends EventTargetInterface | null = EventTargetInterface,
    CurrentTarget extends EventTargetInterface | null = EventTargetInterface
> {
    /**
     * The name identifying the type of the event.
     */
    readonly type: EventName;
    /**
     * The object onto which the event was dispatched, i.e. the source of the event.
     * 
     * Initialy set to null, it will be populated once the event is fired.
     * @default null;
     */
    readonly target: Target | null;
    /**
     * The element to which the event handler has been attached.
     * 
     * Initialy set to null, it will be populated before the event is passed to a handler.
     * @default null;
     */
    readonly currentTarget: CurrentTarget | null;
    /**
     * Does the event bubbles through emitters?
     * The value is set when the event is initialized and cannot be modified.
     * 
     * Currently not implemented, it does nothing at the moment but could be handled later.
     */
    readonly bubbles: boolean;
    /**
     * Can the default behavior of the event be prevented ?
     * The value is set when the event is initialized and cannot be modified.
     */
    readonly cancelable: boolean;
    /**
     * Has the default behavior of the event been prevented via {@link preventDefault preventDefault()}? 
     */
    readonly defaultPrevented: boolean;
    /**
     * Does the event propagate in shadow dom ?
     * 
     * Currently not implemented, it does nothing at the moment but could be handled later.
     */
    readonly composed: boolean;
    /**
     * The time at which the event was created (in milliseconds). By specification, 
     * this value is time since epoch.
     */
    readonly timeStamp: DOMHighResTimeStamp;
    /**
     * Which phase the event finds itself in.
     */
    readonly eventPhase: EVENT_PHASE;
    /**
     * Mimicks the native prop.
     * Will be `true` for events emitted internally by an {@link EventTargetInterface EventTarget},
     * and `false` for events emitted via it's public {@link dispatchEvent EventTargetInterface.dispatchEvent} method.
     * 
     * Just like the native implementation it allows to discriminate between events you know are true and events that might be fabricated. Use with caution.
     * 
     * @readonly
     */
    isTrusted: boolean;
    /**
     * alias for {@link stopPropagation stopPropagation()}
     */
    cancelBubble: boolean;
    /**
     * The result of emitting the event.
     */
    returnValue: boolean;

    /**
     * @internal
     */
    stopPropagationFlag: boolean;
    /**
     * @internal
     */
    stopImmediatePropagationFlag: boolean;
    /**
     * @internal
     */
    canceledFlag: boolean;
    /**
     * @internal
     */
    inPassiveListenerFlag: boolean;
    /**
     * @internal
     */
    composedFlag: boolean;
    /**
     * @internal
     */
    initializedFlag: boolean;
    /**
     * @internal
     */
    dispatchFlag: boolean;

    /**
     * @internal
     * @default null
     */
    relatedTarget: EventTargetInterface | null;

    /**
     * Prevents the default behavior of the mecanism that emitted this event.
     */
    preventDefault(): void;
    /**
     * Prevent the execution of listeners registered after the one currently executed.
     */
    stopImmediatePropagation(): void;
    /**
     * Not planned to do anything but could be used in the future if event propagation is implemented
     */
    stopPropagation(): void;
    /**
     * A list of all the {@link EventTargetInterface EventTarget} the event has transited through,
     * contains usually a single entry with the current target but can be appended to
     * if the event is re-emitted
     */
    composedPath(): SequenceInterface<EventTargetInterface>

    /**
     * @deprecated use the Event constructor instead.
     * @param type name of the event to initialize
     * @param bubbles does the event bubble ?
     * @param cancelable can the event be canceled ?
     */
    initEvent(type: EventName, bubbles: boolean, cancelable: boolean): void
}

export type EventInit = {
    /**
     * Should the event bubble up the emition chain ?
     * 
     * Currently not implemented, it does nothing at the moment but could be handled later.
     * @default false;
     */
    bubbles?: boolean;
    /**
     * Can the default behavior of the event be prevented ?
     * Emulate the way native Events behave.
     * 
     * @default false;
     */
    cancelable?: boolean;
    /**
     * Does the event propagate in shadow dom ?
     * 
     * Currently not implemented, it does nothing at the moment but could be handled later.
     * 
     * @default false;
     */
    composed?: boolean;
}
