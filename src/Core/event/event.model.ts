import { EventInterface } from "../../API/event.interface";
import { ImmutableObject } from "../helper/object.helper";

export type EventInitialValues = {
    cancelable: boolean;
}

export default class Event<Payload> implements EventInterface<Payload> {
    private static readonly initialvalues: EventInitialValues = {
        cancelable: false,
    }

    public readonly payload: ImmutableObject<Payload>;
    public readonly cancelable: boolean = false;
    
    private _isCanceled: boolean = false;
    private _canceledReason: string | null = null;


    constructor(payload: ImmutableObject<Payload>, initValues?: Partial<EventInitialValues>) {
        this.payload = payload;
        this.cancelable = initValues?.cancelable ?? Event.initialvalues.cancelable;
    }

    public get canceledReason(): string | null {
        return this._canceledReason;
    }

    public get isCanceled(): boolean {
        return this._isCanceled;
    }

    public preventDefault(): void;
    public preventDefault(reason?: string): void {
        if (!this.cancelable) {
            throw new Error('Event is not cancelable.');
        }

        this._isCanceled = true;
        this._canceledReason = reason ?? null
    }
}