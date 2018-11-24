import { HNode } from "./HNode";
export interface Store<T extends object = any> {
    get<K extends keyof T>(key: K): T[K];
    set<K extends keyof T>(key: K, value: T[K], force?: boolean): this;
    setter<K extends keyof T>(key: K, force?: boolean): (value: T[K]) => void;
    forward(binding?: HNode, subscriptions?: Array<keyof T>): Store<T>;
}
export declare const createStore: <T extends object = any>(binding?: HNode<any, any, any> | undefined, subscriptions?: (keyof T)[] | undefined, origin?: Store<T> | undefined) => Store<T>;
