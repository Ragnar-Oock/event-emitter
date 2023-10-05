import { AddListenerOptions, EventCollection, EventListenerOptions, EventTargetInterface, Handler } from "../../API/event-target.interface";
import { EventInterface, EventType } from "../../API/event.interface";
import { ListernerInterface } from "../../API/listener.interface";

export type FlattenedOptions = boolean;
export type FlattenedMoreOptions = {
    capture: FlattenedOptions,
    passive: boolean | null,
    once: boolean,
    signal: AbortSignal | null
}

export default class EventTarget<Events extends EventCollection> implements EventTargetInterface<Events> {
    /**
     * The spec's definition is a bit more complexe, but for the purpose of this lib it can be simplified to that.
     * 
     * @see https://dom.spec.whatwg.org/#default-passive-value
     */
    private static getDefaultPassiveValue<events extends EventCollection>(_type: EventType, _eventTarget: EventTarget<events>): boolean {
        return false;
    };

    private eventListenerList: ListernerInterface<Events[keyof Events]>[] = [];

    constructor() {}

    private static addAnEventListener<events extends EventCollection>(target: EventTarget<events>, listener: ListernerInterface<events[keyof events]>): void {
        if (listener.signal !== null && listener.signal.aborted) {
            return;
        }

        if (listener.callback === null) {
            return;
        }

        listener.passive ??= this.getDefaultPassiveValue(listener.type, target);

        const noExistingListernerIsSimilar = target.eventListenerList.every(existingListener => 
            existingListener.type !== listener.type &&
            existingListener.callback !== listener.callback && 
            existingListener.capture !== listener.capture
        );
        if (noExistingListernerIsSimilar) {
            target.eventListenerList.push(listener);
        }

        if (listener.signal !== null) {
            listener.signal.addEventListener('abort', () => this.removeAnEventListener(target, listener));
        }
    }

    public addEventListener<EventName extends (Exclude<keyof Events, number | symbol>)>(type: EventName, callback: Handler<Events[EventName]> = null, options: AddListenerOptions | boolean = {}): void {
        const {capture, passive, once, signal} = EventTarget.flattenMoreOptions(options);
        EventTarget.addAnEventListener(this, {
            type,
            callback,
            capture,
            passive,
            once,
            signal,
            removed: false
        })
    }

    private static removeAnEventListener<events extends EventCollection>(target: EventTarget<events>, listener: ListernerInterface<events[keyof events]>): void {
        listener.removed = true;
        target.eventListenerList = target
            .eventListenerList
            .filter(existingListener => existingListener === listener);
    }

    private static removeAllEventListener(target: EventTarget<EventCollection>): void {
        target.eventListenerList
            .forEach(listener => this.removeAnEventListener(target, listener));
    }

    public removeEventListener<EventName extends (keyof Events)>(type: EventName, callback: Handler<Events[EventName]>, options: EventListenerOptions | boolean = {}): void {
        const capture = EventTarget.flattenOptions(options);

        const listener = this.eventListenerList.find(listener => 
            listener.type == type &&
            listener.callback == callback && 
            listener.capture == capture
        );
        if (typeof listener !== "undefined") {
            EventTarget.removeAnEventListener(this, listener);
        }
    }

    public dispatchEvent<EventName extends (keyof Events)>(event: Events[EventName]): boolean {
        if (event.dispatchFlag === true || event.initializedFlag === false) {
            throw new DOMException('InvalidStateError');
        }

        event.isTrusted = false;

        return EventTarget.dispatch(this, event);
    }

    /**
     * The spec defines an additional `legacyTargetOverrideFlag` but it is only used in cases outside the 
     * bounds of this library to enable mecanismes that can't be emulated by this library.
     */
    private static dispatch<events extends EventCollection>(target: EventTarget<events>, event: events[keyof events], legacyOutputDidListenersThrowFlag = false): boolean {
        event.dispatchFlag = true;
        /**
         * The spec's definition of this step is a bit more complexe, but for the purpose of this lib it can be simplified to that.
         * 
         * @see https://dom.spec.whatwg.org/#dispatching-events
         */
        let targetOverride = target;

        let activationTarget: EventTarget<events> | null = null;
        let relatedTarget: EventTarget<events> = retarget(event.relatedTarget, target);

        if (target !== relatedTarget || target === event.relatedTarget) {
            // step 1 : Let touchTargets be a new list. 
            // N/A

            // step 2 : For each touchTarget of event’s touch target list,
            //          append the result of retargeting touchTarget against target to touchTargets. 
            // N/A

            // step 3 : Append to an event path with event, target, targetOverride, relatedTarget, 
            //          touchTargets, and false. 
            appendToEventPath(event, target, targetOverride, relatedTarget, [], false);

            // step 4 : Let isActivationEvent be true, if event is a MouseEvent object and event’s type 
            //          attribute is "click"; otherwise false. 
            // simplified
            let isActivationEvent = false;

            if (isActivationEvent && target.activationBehavior !== null) {
                activationTarget = target;
            }

            // step 6 : Let slottable be target, if target is a slottable and is assigned, and null otherwise. 
            // simplified

            // step 7 : Let slot-in-closed-tree be false. 
            // simplified

            let parent = target.getParent(event);

            // step 9 : While parent is non-null
            // step 9.1 : If slottable is non-null
            // step 9.1.1 : Assert: parent is a slot. 
            // step 9.1.2 : Set slottable to null.
            // step 9.1.3 : If parent’s root is a shadow root whose mode is "closed", then set slot-in-closed-tree to true
            // step 9.2 : If parent is a slottable and is assigned, then set slottable to parent.
            // step 9.3 : Let relatedTarget be the result of retargeting event’s relatedTarget against parent. 
            // step 9.4 : Let touchTargets be a new list. 
            // step 9.5 : For each touchTarget of event’s touch target list, append the result of retargeting touchTarget against parent to touchTargets. 
            // step 9.6 : If parent is a Window object, or parent is a node and target’s root is a shadow-including inclusive ancestor of parent.
            // step 9.6.1 : If isActivationEvent is true, event’s bubbles attribute is true, activationTarget is null, and parent has activation behavior, then set activationTarget to parent. 
            // step 9.6.2 : Append to an event path with event, parent, null, relatedTarget, touchTargets, and slot-in-closed-tree. 
            // step 9.7 : Otherwise, if parent is relatedTarget, then set parent to null
            // step 9.8 : Otherwise, set target to parent and then:
            // step 9.8.1 : If isActivationEvent is true, activationTarget is null, and target has activation behavior, then set activationTarget to target. 
            // step 9.8.2 : Append to an event path with event, parent, target, relatedTarget, touchTargets, and slot-in-closed-tree. 
            // step 9.9 : If parent is non-null, then set parent to the result of invoking parent’s get the parent with event. 
            // step 9.10 : Set slot-in-closed-tree to false. 


            
        }

    }

    protected getParent(_event: EventInterface): EventTargetInterface | null {
        return null;
    }

    protected activationBehavior: ((event: EventInterface<Exclude<keyof Events, number | symbol>>) => {}) | null = null;

    private static flattenOptions(options: EventListenerOptions | boolean): FlattenedOptions {
        if (typeof options === 'boolean') {
            return options;
        }

        return options.capture ?? false;
    }

    private static flattenMoreOptions(options: AddListenerOptions | boolean): FlattenedMoreOptions {
        const capture = this.flattenOptions(options);
        let once = false;
        let passive = null;
        let signal = null;
        
        if (options !== null && typeof options === 'object') {
            once = options.once ?? once;
            passive = options.passive ?? passive;
            signal = options.signal ?? signal;
        }

        return {
            capture,
            once,
            passive,
            signal
        };

    }
}