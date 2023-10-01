import type { EventEmitterInterface, Handler, ListenerOptions } from "../API/event-emitter.interface";
import { EventType, EventInterface } from "../API/event.interface";

export type ListenerObject<ET extends EventType, EventPayload extends any, Passive extends boolean = boolean, Once extends boolean = boolean> = {
    handler: Handler<ET, EventPayload>;
    options?: Partial<ListenerOptions<Passive, Once>>;
    markedForRemoval: boolean;
}

export type PassiveListener<EventName extends EventType, EventPayload extends any, Once extends boolean = boolean> = ListenerObject<EventName, EventPayload, true, Once>;
export type ActiveListener<EventName extends EventType, EventPayload extends any, Once extends boolean = boolean> = ListenerObject<EventName, EventPayload, false, Once>;

export type PassiveListenerCollection<events extends Record<EventType, any>> = {
    [EventName in keyof events]: ListenerObject<EventName, events[EventName], true, boolean>[]
};
export type ActiveListenerCollection<events extends Record<EventType, any>> = {
    [EventName in keyof events]: ListenerObject<EventName, events[EventName], false, boolean>[]
};

export default class EventEmitter<events extends Record<EventType, any>> implements EventEmitterInterface<events> {
    private passiveListeners: Partial<PassiveListenerCollection<events>> = {};
    private activeListeners: Partial<ActiveListenerCollection<events>> = {};

    constructor() {
        
    }

    public addEventListener<EventName extends (keyof events)|EventType>(eventName: EventName, handler: Handler<EventName, events[EventName]>, listenerOptions?: Partial<ListenerOptions<boolean, boolean>>): this {
        // The signal has already been aborded, there's no need to add the listner
        if (listenerOptions?.signal && listenerOptions.signal.aborted) {
            return this;
        }
        
        const isPassive = listenerOptions?.passive ?? false;
        
        if (isPassive) {
            const passiveListeners = this.passiveListeners[eventName] ?? [];

            passiveListeners.push({
                handler,
                options: listenerOptions as Partial<ListenerOptions<true>>,
                markedForRemoval: false
            })
            this.passiveListeners[eventName] = passiveListeners;
        }
        else {
            
            const passibeListeners = this.activeListeners[eventName] ?? [];

            passibeListeners.push({
                handler,
                options: listenerOptions as Partial<ListenerOptions<false>>,
                markedForRemoval: false
            })
            this.activeListeners[eventName] = passibeListeners;
        }

        listenerOptions?.signal?.addEventListener('abort', () => {
            this.removeEventListener(eventName, handler);
        });

        return this;
    }

    public removeEventListener<EventName extends (keyof events)|EventType>(event: EventName, handler: Handler<EventName, events[EventName]>): this {
        this.passiveListeners[event] = this.passiveListeners[event]
            ?.filter(listener =>
                listener.handler !== handler
            );
        this.activeListeners[event] = this.activeListeners[event]
            ?.filter(listener =>
                listener.handler !== handler
            );
            
        return this;
    }

    public async dispatchEvent<EventName extends (keyof events)|EventType>(event: EventInterface<EventName, events[EventName]>, defaultBehavior?: (this: this) => void): Promise<this> {

        const {passive, active} = this.getListenersForEvent(event.type);

        try {
            this.processPassiveListeners(passive, event);
            await this.processActiveListeners(active, event);

            this.cleanUpOnceListeners(event.type);
        
            if (!event.defaultPrevented) {
                defaultBehavior?.call(this);
            }
        } catch (error) {
            console.log(error);
            // todo figure out what to do here
        }

        return this;
    }

    private getListenersForEvent<EventName extends keyof events>(eventName: EventName): {passive: PassiveListener<EventName, events[EventName]>[], active: ActiveListener<EventName, events[EventName]>[]} {
        return {
            active: this.activeListeners[eventName] ?? [],
            passive: this.passiveListeners[eventName] ?? []
        };
    }

    private async processPassiveListeners<EventName extends keyof events>(passiveListeners: PassiveListenerCollection<events>[EventName], event: EventInterface<EventName, events[EventName]>): Promise<void> {
        await Promise.all(
            passiveListeners.map(listener => new Promise<void>((resolve, reject) => {
                try {
                    listener.handler?.call(this, event);
                    listener.markedForRemoval = (listener.options?.once === true);

                    resolve();
                }
                catch (error) {
                    reject(error);
                }
            }))
        );
    }

    private async processActiveListeners<EventName extends keyof events>(activeListeners: ActiveListenerCollection<events>[EventName], event: EventInterface<EventName, events[EventName]>): Promise<void> {
        if (activeListeners.length === 0) {
            return;
        }

        const localListeners = Array.from(activeListeners);

        for (const listener of localListeners) {
            setTimeout(() => {
                listener.handler?.call(this, event);
                listener.markedForRemoval = (listener.options?.once === true);
            });
        }
    }

    protected cleanUpOnceListeners<EventName extends keyof events>(eventName: EventName): void {
        this.activeListeners[eventName] = this.activeListeners[eventName]
            ?.filter(({ markedForRemoval}) => !markedForRemoval);

        this.passiveListeners[eventName] = this.passiveListeners[eventName]
            ?.filter(({ markedForRemoval}) => !markedForRemoval);
    }
}