import type { CustomEventInit, CustomEventInterface } from "../../API/custom-event.interface";
import { EventTargetInterface } from "../../API/event-target.interface";
import { EventType } from "../../API/event.interface";
import Event from '../event/event.model';

export default class CustomEvent<
EventName extends EventType = EventType,
Target extends EventTargetInterface = EventTargetInterface,
CurrentTarget extends EventTargetInterface = EventTargetInterface,
Detail = any
> extends Event<EventName, Target, CurrentTarget> implements CustomEventInterface<EventName, Target, CurrentTarget, Detail> {

    private _detail: Detail | null;

    constructor(type: EventName, eventInitDict: CustomEventInit<Detail>) {
        super(type, eventInitDict);
        this._detail = eventInitDict?.detail ?? null;
    }

    public get detail(): Detail | null {
        return this._detail;
    }

    public initCustomEvent(type: EventName, bubbles = false, cancelable = false, detail: Detail | null = null): void {
        if (this.dispatchFlag) {
            return;
        }

        Event.initialize(this, type, bubbles, cancelable);
        this._detail = detail;
    }
}