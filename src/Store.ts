import { _Map, _splice } from "./refCache";
import { HNode } from "./HNode";
import { mark } from "./ticker";
import { HUI } from "./HUI";

type AssertArray<T> = T extends any[] ? T : never;

export interface Store<T extends object = any> {
    get<K extends keyof T>(key: K): T[K];
    set<K extends keyof T>(key: K, value: T[K], force?: boolean): this;
    setter<K extends keyof T>(key: K, force?: boolean): (value: T[K]) => void;
    forward(binding?: HNode, subscriptions?: Array<keyof T>): Store<T>;
    toggle(key: keyof T): this;
    inc(key: keyof T, addition?: any): this;
    push<K extends keyof T>(key: K, ...items: AssertArray<T[K]>): this;
    unshift<K extends keyof T>(key: K, ...items: AssertArray<T[K]>): this;
    slice(key: keyof T, start: number, end: number): this;
    splice<K extends keyof T>(key: K, start: number, deleteCount?: number): this;
    splice<K extends keyof T>(key: K, start: number, deleteCount: number, ...items: AssertArray<T[K]>): this;
}

export const createStore = function c<T extends object = any>(
    binding?: HNode<any>, subscriptions?: Array<keyof T>, origin?: Store<T>
): Store<T> {

    const map = origin || new _Map(),
        copies = new Array<Store<T>>();

    const store: Store<T> = {

        get(key) {
            return origin ? origin.get(key) : (map as Map<any, any>).get(key);
        },

        set(key, value, force) {

            if (force || !HUI.cmp(value, store.get(key))) {

                if (origin) {
                    origin.set(key, value);
                } else {
                    (map as Map<any, any>).set(key, value);
                }

                if (binding && binding.active && subscriptions && subscriptions.includes(key)) {
                    mark(binding);
                }

                copies.forEach(copy => {
                    copy.set(key, value, true);
                });

            }

            return store;

        },

        setter(key, force) {
            return function (value) {
                store.set(key, value, force);
            };
        },

        forward(newBinding, newSubscriptions) {
            const newStore = createStore(newBinding, newSubscriptions, store);
            copies.push(newStore);
            return newStore;
        },

        toggle(key) {
            return store.set(key, !store.get(key) as any);
        },

        inc(key, addition = 1) {
            return store.set(key, store.get(key) + addition);
        },

        push(key, ...items) {
            return store.set(key, (store.get(key) as unknown as any[]).concat(items) as any);
        },

        unshift(key, ...items) {
            return store.set(key, items.concat(store.get(key)) as any);
        },

        slice(key, start, end) {
            return store.set(key, (store.get(key) as unknown as any[]).slice(start, end) as any);
        },

        splice(key: keyof T, start: number, deleteCount: number, ...items: any[]) {
            const arr = (store.get(key) as unknown as any[]).slice();
            _splice.apply(arr, [start, deleteCount].concat(items) as [number, number, ...any[]]);
            return store.set(key, arr as any);
        }

    };

    return store;

};
