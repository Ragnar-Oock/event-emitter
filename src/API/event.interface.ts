
/**
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase}
 */
export enum EVENT_PHASE {
    /**
     * The event is not being processed at this time.
     */
    NONE = 0,
    /**
     * The event has arrived at the event's target. Event listeners registered for this phase are called at this time.
     */
    AT_TARGET = 2
}

export type EventType = string | number | symbol;

export interface EventInterface<EventName extends EventType, Payload = any> {
    /**
     * Information caried by the event.
     */
    readonly payload: Readonly<Payload>;
    /**
     * Can the default behavior of the event be prevented ?
     * Emulate the way native Events behave.
     */
    readonly cancelable: boolean;
    /**
     * Has the default behavior of the event been prevented ? 
     */
    readonly defaultPrevented: boolean;
    /**
     * The time at which the event was created (in milliseconds). By specification, 
     * this value is time since epoch.
     */
    readonly timeStamp: DOMHighResTimeStamp;
    /**
     * The name identifying the type of the event.
     */
    readonly type: EventName;
    /**
     * Which phase the event finds itself in
     */
    readonly eventPhase: EVENT_PHASE;
    /**
     * Has the immediate propagation of the event been prevented ?
     * @internal
     */
    readonly immediatePropagationStoped: boolean;
    
    /**
     * Prevents the default behavior of the mecanism that emitted this event.
     */
    preventDefault(): void;
    /**
     * Prevent the execution of listeners registered after the one currently executed.
     */
    stopImmediatePropagation(): void; // todo figure out how to make this work
}

export type EventOptions = {
    /**
     * Can the default behavior of the event be prevented ?
     * Emulate the way native Events behave.
     * 
     * @default true;
     */
    cancelable: boolean;
}
