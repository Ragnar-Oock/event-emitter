import { EventCollection, EventEmitterInterface, EventsFromEmitter } from "../API/event-emitter.interface";
import { EventInterface } from "../API/event.interface";
import { SubscriberInterface, Subscribtion } from "../API/subscriber.interface";
import { OneOrArrayOf } from "./helper/type.helper";

export default class Subscriber implements SubscriberInterface {
    public readonly id: string;

    constructor(id: string) {
        this.id = id;
    }
    
    public subscribe<emitter extends EventEmitterInterface<EventCollection>>(subscribtion: Subscribtion<emitter>): this;
    public subscribe<emitter extends EventEmitterInterface<EventCollection>>(subscribtionList: Subscribtion<emitter>[]): this;
    public subscribe<emitter extends EventEmitterInterface<EventCollection>>(subscribtionOrSubscribtionList: OneOrArrayOf<Subscribtion<emitter>>): this {
        if (Array.isArray(subscribtionOrSubscribtionList)) {
            subscribtionOrSubscribtionList.forEach(subscribtion => this.subscribeOne(subscribtion));
        }
        else {
            this.subscribeOne(subscribtionOrSubscribtionList);
        }
        return this;
    }

    private subscribeOne<emitter extends EventEmitterInterface<EventCollection>>({from, name, action}: Subscribtion<emitter>): void {
        from.addEventListener(name, action);
    }
    
    public unSubscribe<emitter extends EventEmitterInterface<EventCollection>>(subscribtion: Subscribtion<emitter>): this;
    public unSubscribe<emitter extends EventEmitterInterface<EventCollection>>(subscribtionList: Subscribtion<emitter>[]): this;
    public unSubscribe<emitter extends EventEmitterInterface<EventCollection>>(subscribtionOrSubscribtionList: OneOrArrayOf<Subscribtion<emitter>>): this {
        if (Array.isArray(subscribtionOrSubscribtionList)) {
            subscribtionOrSubscribtionList.forEach(subscribtion => this.unSubscribeOne(subscribtion));
        }
        else {
            this.unSubscribeOne(subscribtionOrSubscribtionList);
        }
        return this;
    }

    
    private unSubscribeOne<emitter extends EventEmitterInterface<EventCollection>>({from, name, action}: Subscribtion<emitter>): void {
        from.removeEventListener(name, action);
    }
}

type E =EventEmitterInterface<{
    change: EventInterface<{status: number}>
}>;
let EmitterInstance: E;

const sub: Subscribtion<E> = {
    from: EmitterInstance,
    name: 'change',
    action: (e)=> console.log(e),

}

let a: EventCollection;
let b: EventsFromEmitter<EventEmitterInterface<EventCollection>> = {};

a = b;

EmitterInstance.removeEventListener('change', (e: EventInterface<{status: number}>) => console.log(e));

const Sub = new Subscriber('sub');
Sub.subscribe<E>(sub);