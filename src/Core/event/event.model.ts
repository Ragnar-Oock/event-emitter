import { EventTargetInterface } from "../../API/event-target.interface";
import { EVENT_PHASE, EventInterface, EventType, EventInit } from "../../API/event.interface";
import { SequenceInterface } from "../../API/sequence.interface";
import { warn } from "../helper/log.helper";

export default class Event<
    EventName extends EventType,
    Target extends EventTargetInterface = EventTargetInterface,
    CurrentTarget extends EventTargetInterface = EventTargetInterface
    > implements EventInterface<EventName, Target, CurrentTarget> {
        
    private _type: EventName;
    private _bubbles: boolean;
    private _cancelable: boolean;
    private _target: Target | null = null;
    private _currentTarget: CurrentTarget | null = null;
    private _eventPhase: EVENT_PHASE = EVENT_PHASE.NONE;
    private _isTrusted: boolean = false;
    private readonly _timeStamp: DOMHighResTimeStamp = performance.now();

    /**
     * @internal
     */
    public stopPropagationFlag: boolean = false;
    /**
     * @internal
     */
    public stopImmediatePropagationFlag: boolean = false;
    /**
     * @internal
     */
    private _canceledFlag: boolean = false;
    /**
     * @internal
     */
    public inPassiveListenerFlag: boolean = false;
    /**
     * @internal
     */
    public composedFlag: boolean;
    /**
     * @internal
     */
    public initializedFlag: boolean = false;
    /**
     * @internal
     */
    public dispatchFlag: boolean = false;


    constructor(type: EventName, initValues?: EventInit) {
        this._type = type;
        this._cancelable = initValues?.cancelable ?? false;
        this._bubbles = initValues?.bubbles ?? false;
        this.composedFlag = initValues?.composed ?? false;
    }

    /**
     * @inheritdoc
     */
    public get type(): EventName {
        return this._type;
    }

    /**
     * @inheritdoc
     */
    public get bubbles(): boolean {
        return this._bubbles;
    }
    
    /**
     * @inheritdoc
     */
    public get cancelable(): boolean {
        return this._cancelable;
    }

    /**
     * @inheritdoc
     */
    public get target(): Target | null {
        return this._target;
    }

    public composedPath(): SequenceInterface<EventTargetInterface> {
        return Object.freeze([]);
    }

    /**
     * @inheritdoc
     */
    public get currentTarget(): CurrentTarget | null {
        return this._currentTarget;
    }

    /**
     * @inheritdoc
     */
    public get timeStamp(): DOMHighResTimeStamp {
        return this._timeStamp;
    }

    /**
     * @inheritdoc
     */
    public get eventPhase(): EVENT_PHASE {
        return this._eventPhase;
    }
    
    /**
     * @inheritdoc
     */
    public stopPropagation(): void {
        this.stopPropagationFlag = true;
    }
    /**
     * @inheritdoc
     */
    public get cancelBubble(): boolean {
        return this.stopPropagationFlag === true;
    }
    /**
     * @inheritdoc
     */
    public set cancelBubble(value: boolean) {
        if (value) {
            this.stopPropagationFlag = true;
        }
    }
    /**
     * @inheritdoc
     */
    public stopImmediatePropagation(): void {
        this.stopPropagationFlag = true;
        this.stopImmediatePropagationFlag = true;
    }

    /**
     * @internal
     */
    public get canceledFlag(): boolean {
        return this._canceledFlag;
    }
    /**
     * @inheritdoc
     */
    public set canceledFlag(_value: boolean) {
        if (this.cancelable && !this.inPassiveListenerFlag) {
            this._canceledFlag = true;
        }
    }

    /**
     * @inheritdoc
     */
    public get returnValue(): boolean {
        return !this.canceledFlag;
    }
    /**
     * @inheritdoc
     */
    public set returnValue(value: boolean) {
        if (!value) {
            this.canceledFlag = true;
        }
    }

    /**
     * @inheritdoc
     */
    public preventDefault(): void {
        this.canceledFlag = true;

        if (!this.canceledFlag) {
            warn(`The event ${this}'s default behavior cannot be prevented as it was initialized with cancelable=false`)
        }
    }

    /**
     * @inheritdoc
     */
    public get defaultPrevented(): boolean {
        return this.canceledFlag;
    }

    /**
     * @inheritdoc
     */
    public get composed(): boolean {
        return this.composedFlag;
    }

    /**
     * @inheritdoc
     */
    public get isTrusted(): boolean {
        return this._isTrusted;
    }

    protected static initialize<EventName extends EventType>(event: Event<EventName>, type: EventName, bubbles: boolean, cancelable: boolean): Event<EventName> {
        event.initializedFlag = true;

        event.stopPropagationFlag = false;
        event.stopImmediatePropagationFlag = false;
        event.canceledFlag = false;

        event._isTrusted = false;

        event._target = null;

        event._type = type;
        event._bubbles = bubbles;
        event._cancelable = cancelable;

        return event;
    }

    /**
     * @inheritdoc
     */
    public initEvent(type: EventName, bubbles: boolean, cancelable: boolean): void {
        if (this.dispatchFlag) {
            return;
        }

        Event.initialize(this, type, bubbles, cancelable);
    }
    

}