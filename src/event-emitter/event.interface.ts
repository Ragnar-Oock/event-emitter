export interface EventInterface<Payload extends Record<string, any> = {}> {
    /**
     * Information caried by the event.
     */
    payload: Payload;
    /**
     * Can the default behavior of the event be prevented ?
     * Emulate the way native Events behave.
     */
    readonly cancelable: boolean;
    /**
     * Has the default behavior of the event been prevented ? 
     */
    readonly isCanceled: boolean;
    /**
     * Reason for the canceling of the event, if one was given and the event is canceled.
     */
    readonly canceledReason: string | null;
    /**
     * Prevents the default behavior of the mecanism that emitted this event.
     */
    preventDefault(reason?: string): void;
}