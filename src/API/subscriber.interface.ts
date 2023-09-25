import { EventCollection, EventsFromEmitter, EventEmitterInterface, Handler } from "./event-emitter.interface";

export type Subscribtion<
    emitter extends EventEmitterInterface<EventCollection>,
    events extends EventsFromEmitter<emitter> = EventsFromEmitter<emitter>
> = {
    from: emitter;
    name: Exclude<keyof events, number|Symbol>;
    action: Handler<emitter, events[keyof events]>,
};

export interface SubscriberInterface {
    subscribe<emitter extends EventEmitterInterface>(subscribtion: Subscribtion<emitter, EventsFromEmitter<emitter>>): this
    subscribe<emitter extends EventEmitterInterface>(subscribtionList: Subscribtion<emitter, EventsFromEmitter<emitter>>[]): this;

    unSubscribe<emitter extends EventEmitterInterface>(subscribtion: Omit<Subscribtion<emitter, EventsFromEmitter<emitter>>, 'action'>): this;
    unSubscribe<emitter extends EventEmitterInterface>(subscribtionList: Omit<Subscribtion<emitter, EventsFromEmitter<emitter>>, 'action'>[]): this;
}