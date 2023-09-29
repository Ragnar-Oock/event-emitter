import { EventEmitterInterface } from "../API/event-emitter.interface";
import { SubscriberInterface, Subscribtion } from "../API/subscriber.interface";
import { OneOrArrayOf } from "./helper/type.helper";

export default class Subscriber implements SubscriberInterface {
    public readonly id: string;

    private subscriptions: Subscribtion<EventEmitterInterface>[] = [];

    constructor(id: string) {
        this.id = id;
    }
    
    public subscribe<emitter extends EventEmitterInterface>(subscribtion: Subscribtion<emitter>): this;
    public subscribe<emitter extends EventEmitterInterface>(subscribtionList: Subscribtion<emitter>[]): this;
    public subscribe<emitter extends EventEmitterInterface>(subscribtionOrSubscribtionList: OneOrArrayOf<Subscribtion<emitter>>): this {
        if (Array.isArray(subscribtionOrSubscribtionList)) {
            subscribtionOrSubscribtionList.forEach(subscribtion => this.subscribeOne(subscribtion));

            this.subscriptions.push(...subscribtionOrSubscribtionList);
        }
        else {
            this.subscribeOne(subscribtionOrSubscribtionList);
            this.subscriptions.push(subscribtionOrSubscribtionList);
        }
        return this;
    }

    private subscribeOne<emitter extends EventEmitterInterface>({from, name, action, options}: Subscribtion<emitter>): void {
        from.addEventListener(name, action, options);
    }
    
    public unSubscribe<emitter extends EventEmitterInterface>(subscribtion: Subscribtion<emitter>): this;
    public unSubscribe<emitter extends EventEmitterInterface>(subscribtionList: Subscribtion<emitter>[]): this;
    public unSubscribe<emitter extends EventEmitterInterface>(subscribtionOrSubscribtionList: OneOrArrayOf<Subscribtion<emitter>>): this {
        if (Array.isArray(subscribtionOrSubscribtionList)) {
            subscribtionOrSubscribtionList.forEach(subscribtion => this.unSubscribeOne(subscribtion));
        }
        else {
            this.unSubscribeOne(subscribtionOrSubscribtionList);
        }
        return this;
    }

    private unSubscribeOne<emitter extends EventEmitterInterface>({from, name, action, options}: Subscribtion<emitter>): void {
        from.removeEventListener(name, action, options);
    }

    public unSubscribeAll(): this {
        Array
            .from(this.subscriptions)
            .forEach(subscription => this.subscribeOne(subscription));

        return this;
    }
}
