import { _Map, _splice } from "../utils/refCache";
import { HNode } from "./HNode";
import { mark } from "./ticker";
import { HUI } from "./HUI";

type AssertArray<T> = T extends any[] ? T : never;
type MapOf<T> = Map<keyof T, Pick<T, keyof T>>;

export interface Store<T extends object = any> {

    map: MapOf<T>;

    bind(hNode: HNode<any>, subscriptions: Array<keyof T>): this;

    get<K extends keyof T>(key: K): T[K] | undefined;
    set<K extends keyof T>(key: K, value: T[K], force?: boolean): this;
    setter<K extends keyof T>(key: K, force?: boolean): (value: T[K]) => void;

    toggle(key: keyof T): this;

    inc(key: keyof T, addition?: any): this;

    push<K extends keyof T>(key: K, ...items: AssertArray<T[K]>): this;
    unshift<K extends keyof T>(key: K, ...items: AssertArray<T[K]>): this;
    slice(key: keyof T, start: number, end: number): this;
    splice<K extends keyof T>(key: K, start: number, deleteCount?: number): this;
    splice<K extends keyof T>(key: K, start: number, deleteCount: number, ...items: AssertArray<T[K]>): this;

}

export const createStore = function <T extends object = any>(): Store<T> {

    const map = new _Map<keyof T, any>(),
        bindingMap = new _Map<keyof T, Array<HNode<any>>>();

    const store: Store<T> = {

        map,

        bind(hNode, subscriptions) {
            subscriptions.forEach(key => {
                if (bindingMap.has(key)) {
                    bindingMap.get(key)!.push(hNode);
                } else {
                    bindingMap.set(key, [hNode]);
                }
            });
            return this;
        },

        get: function store_get(key) {
            return map.get(key);
        },

        set: function store_set(key, value, force) {

            if (force || !HUI.cmp(value, store.get(key))) {

                map.set(key, value);

                if (bindingMap.has(key)) {
                    bindingMap.get(key)!.forEach(hNode => {
                        if (hNode.active) {
                            mark(hNode);
                        }
                    });
                }

            }

            return store;

        },

        setter: function store_setter(key, force) {
            return function (value) {
                store.set(key, value, force);
            };
        },

        toggle: function store_toggle(key) {
            return store.set(key, !store.get(key) as any);
        },

        inc: function store_inc(key, addition = 1) {
            return store.set(key, store.get(key) + addition);
        },

        push: function store_push(key, ...items) {
            return store.set(key, (store.get(key) as unknown as any[]).concat(items) as any);
        },

        unshift: function store_unshift(key, ...items) {
            return store.set(key, items.concat(store.get(key)) as any);
        },

        slice: function store_slice(key, start, end) {
            return store.set(key, (store.get(key) as unknown as any[]).slice(start, end) as any);
        },

        splice: function store_splice(key: keyof T, start: number, deleteCount: number, ...items: any[]) {
            const arr = (store.get(key) as unknown as any[]).slice();
            _splice.apply(arr, [start, deleteCount].concat(items) as [number, number, ...any[]]);
            return store.set(key, arr as any);
        }

    };

    return store;

};
