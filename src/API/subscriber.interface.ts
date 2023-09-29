import { EventsFromEmitter, EventEmitterInterface, Handler, ListenerOptions } from "./event-emitter.interface";

export type Subscribtion<emitter extends EventEmitterInterface> = {
    from: emitter;
    name: Exclude<keyof EventsFromEmitter<emitter>, number|Symbol>;
    action: Handler<EventsFromEmitter<emitter>[keyof EventsFromEmitter<emitter>]>,
    options: ListenerOptions
};

export interface SubscriberInterface {
    subscribe<emitter extends EventEmitterInterface>(subscribtion: Subscribtion<emitter>): this
    subscribe<emitter extends EventEmitterInterface>(subscribtionList: Subscribtion<emitter>[]): this;

    unSubscribe<emitter extends EventEmitterInterface>(subscribtion: Omit<Subscribtion<emitter>, 'action'>): this;
    unSubscribe<emitter extends EventEmitterInterface>(subscribtionList: Omit<Subscribtion<emitter>, 'action'>[]): this;

    unSubscribeAll(): this;
}