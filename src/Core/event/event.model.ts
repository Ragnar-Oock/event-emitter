import { EVENT_PHASE, EventInterface } from "../../API/event.interface";

export type EventInitialValues = {
    cancelable: boolean;
}

export default class Event<Type extends string, Payload> implements EventInterface<Type, Payload> {
    private static readonly initialvalues: EventInitialValues = {
        cancelable: false,
    }

    public readonly type: Type;
    public readonly payload: Payload;
    public readonly cancelable: boolean = false;
    public readonly timeStamp: DOMHighResTimeStamp = performance.now();
        
    private _defaultPrevented: boolean = false;
    private _eventPhase: EVENT_PHASE = EVENT_PHASE.NONE;
    private _immediatePropagationStoped: boolean = false;

    constructor(type: Type, payload: Payload, initValues?: Partial<EventInitialValues>) {
        this.type = type;
        this.payload = payload;
        this.cancelable = initValues?.cancelable ?? Event.initialvalues.cancelable;
    }

    public get defaultPrevented(): boolean {
        return this._defaultPrevented;
    }

    public get eventPhase(): EVENT_PHASE {
        return this._eventPhase;
    }
    
    /**
     * @inheritdoc
     */
    public get immediatePropagationStoped(): boolean {
        return this._immediatePropagationStoped;
    }

    public preventDefault(): void;
    public preventDefault(): void {
        if (!this.cancelable) {
            return;
        }

        this._defaultPrevented = true;
    }

    public stopImmediatePropagation(): void {
        this._immediatePropagationStoped = true;
    }
}