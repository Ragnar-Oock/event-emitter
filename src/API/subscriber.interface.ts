import type { EventsFromEmitter, EventEmitterInterface, Handler, ListenerOptions } from "./event-emitter.interface";

export type Subscribtion<emitter extends EventEmitterInterface, events extends EventsFromEmitter<emitter> = EventsFromEmitter<emitter>, event extends keyof events = keyof events> = {
    from: emitter;
    name: event;
    action: Handler<event, events[event]>,
    options?: ListenerOptions
};

export interface SubscriberInterface {
    // subscribe<emitter extends EventEmitterInterface>(subscribtion: Subscribtion<emitter>): this
    subscribe<emitter extends EventEmitterInterface>(subscribtionList: Subscribtion<emitter>[]): this;

    // unSubscribe<emitter extends EventEmitterInterface>(subscribtion: Omit<Subscribtion<emitter>, 'action'>): this;
    unSubscribe<emitter extends EventEmitterInterface>(subscribtionList: Omit<Subscribtion<emitter>, 'action'>[]): this;

    unSubscribeAll(): this;
}