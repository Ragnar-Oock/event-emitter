import { EventTargetInterface } from "../../API/event-target.interface";
import { EVENT_PHASE, EventInterface, EventType, EventInit } from "../../API/event.interface";
import { SequenceInterface } from "../../API/sequence.interface";
import { warn } from "../helper/log.helper";

export default class Event<
    EventName extends EventType,
    Target extends EventTargetInterface | null = EventTargetInterface,
    CurrentTarget extends EventTargetInterface | null = EventTargetInterface
    > implements EventInterface<EventName, Target, CurrentTarget> {
        
    private _type: EventName;
    private _bubbles: boolean;
    private _cancelable: boolean;
    private _target: Target | null = null;
    private _currentTarget: CurrentTarget | null = null;
    private _eventPhase: EVENT_PHASE = EVENT_PHASE.NONE;

    /**
     * No idea how or when to set this to true...
     */
    private _isTrusted: boolean = false;
    private readonly _timeStamp: DOMHighResTimeStamp;

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


    constructor(type: EventName, eventInitDict?: EventInit) {
        // STEP 1 : inner event creation step (this can't be a method because of the readonly nature of {@link _timeStamp} and I don't want to make a getter for it...)
    
        // step 1 : Let event be the result of creating a new object using eventInterface. If realm is non-null, then use that realm; otherwise, use the default behavior defined in Web IDL. 
        // N/A => event is `this`

        // step 2 : Set event’s initialized flag. 
        this.initializedFlag = true;

        // step 3 : Initialize event’s timeStamp attribute to the relative high resolution coarse time given time and event’s relevant global object. 
        this._timeStamp = performance.now();

        // step 4 : For each `member → value` in `dictionary`, if event has an attribute whose identifier is `member`, then initialize that attribute to `value`.
        this._cancelable = eventInitDict?.cancelable ?? false;
        this._bubbles = eventInitDict?.bubbles ?? false;
        this.composedFlag = eventInitDict?.composed ?? false;

        // step 5 : Run the event constructing steps with event and dictionary. 
        this.onConstruct(this as Event<EventName, null, null>, eventInitDict);

        // STEP 2 : Initialize event’s type attribute to type. 
        this._type = type;

        // STEP 3 : Return event. 
        // N/A
    }

    /**
     * This method can be used by Event subclasses that have a more complex structure than a simple 1:1 mapping
     * between their initializing dictionary members and IDL attributes.
     * 
     * @param event The event being constructed (event === this)
     * @param eventInitDict The dictionary object passed as the second parameter of the constructor
     */
    protected onConstruct(event: Event<EventName, null, null>, eventInitDict: EventInit | undefined): void {
        // no-op
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