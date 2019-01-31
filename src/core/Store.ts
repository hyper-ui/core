import { _Map, _splice, _entries } from "../utils/refCache";
import { HNode } from "./HNode";
import { mark } from "../ticker/ticker";
import { HUI } from "./HUI";
import { SpliceArgs } from "../utils/helpers";

type AssertArray<T> = T extends any[] ? T : never;
type MapOf<T> = Map<keyof T, Pick<T, keyof T>>;

export type Setter<T = unknown> = (value: T) => void;
export type SetterRecord<T = unknown> = [Setter<T> | undefined, Setter<T> | undefined];

export type HandlerMap<T extends object =any, H extends object = any> = {
    [K in keyof H]: H[K] extends (this: Store<T, H>, ...args: infer A) => any ? (
        H[K] extends (this: Store<T, H>, ...args: A) => infer R ? (
            (this: Store<T, H>, ...args: A) => R
        ) : (
            never
        )
    ) : (
        never
    );
};

export type StoreType<S extends Store> = S extends Store<infer T> ? T : never;
export type StoreHandlers<S extends Store> = S extends Store<any, infer H> ? H : never;

export type EmptyStore = Store<{}, {}>;

export interface Store<T extends object = any, H extends object = any> {

    valueMap: MapOf<T>;
    bindingMap: Map<keyof T, HNode<any>[]>;
    setterMap: Map<keyof T, SetterRecord<any>>;
    handlerMap: MapOf<HandlerMap<T, H>>;

    bind(hNode: HNode<any>, subscriptions: Array<keyof T>): this;

    get<K extends keyof T>(key: K): T[K] | undefined;
    set<K extends keyof T>(key: K, value: T[K], force?: boolean): this;
    setter<K extends keyof T>(key: K, force?: boolean): Setter<T[K]>;
    setSome(pairs: Partial<T>, forces?: boolean): this;

    toggle(key: keyof T): this;

    inc(key: keyof T, addition?: any): this;

    push<K extends keyof T>(key: K, ...items: AssertArray<T[K]>): this;
    unshift<K extends keyof T>(key: K, ...items: AssertArray<T[K]>): this;
    slice(key: keyof T, start: number, end?: number): this;
    splice<K extends keyof T>(key: K, start: number, deleteCount?: number): this;
    splice<K extends keyof T>(key: K, start: number, deleteCount: number, ...items: AssertArray<T[K]>): this;

    handle<N extends keyof HandlerMap<T, H>>(name: N, handler?: HandlerMap<T, H>[N]): this;
    handleSome(handlers: Partial<HandlerMap<T, H>>): this;
    getHandler<N extends keyof HandlerMap<T, H>>(name: N): HandlerMap<T, H>[N] | undefined;
    trigger<N extends keyof HandlerMap<T, H>>(name: N, ...args: Parameters<HandlerMap<T, H>[N]>): ReturnType<HandlerMap<T, H>[N]> | undefined;

}

export const createStore = function crtSto<
    T extends object = any, H extends object = any
>(): Store<T, H> {

    const valueMap = new _Map<keyof T, any>(),
        bindingMap = new _Map<keyof T, HNode<any>[]>(),
        setterMap = new _Map<keyof T, SetterRecord<any>>(),
        handlerMap = new _Map<keyof HandlerMap<T, H>, any>();

    const store: Store<T, H> = {

        valueMap,
        bindingMap,
        setterMap,
        handlerMap,

        bind: function s_bind(hNode, subscriptions) {
            subscriptions.forEach(key => {
                if (bindingMap.has(key)) {
                    bindingMap.get(key)!.push(hNode);
                } else {
                    bindingMap.set(key, [hNode]);
                }
            });
            return this;
        },

        get: function s_get(key) {
            return valueMap.get(key);
        },

        set: function s_set(key, value, force) {

            if (force || !HUI.cmp(value, store.get(key))) {

                valueMap.set(key, value);

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

        setter: function s_setter(key, force) {

            const index = +!force;

            if (setterMap.has(key)) {

                const setters = setterMap.get(key)!,
                    setter = setters[index];

                if (setter) {
                    return setter;
                } else {
                    return setters[index] = function setter(value: any) {
                        store.set(key, value, force);
                    };
                }

            } else {

                const setters = new Array<Setter>();

                setterMap.set(key, setters as SetterRecord<any>);

                return setters[index] = function setter(value: any) {
                    store.set(key, value, force);
                };

            }

        },

        setSome: function s_setSome(pairs, force) {
            _entries(pairs).forEach(pair => {
                store.set(pair[0] as keyof T, pair[1], force);
            });
            return this;
        },

        toggle: function s_toggle(key) {
            return store.set(key, !store.get(key) as unknown as T[keyof T]);
        },

        inc: function s_inc(key, addition = 1) {
            return store.set(key, store.get(key) + addition);
        },

        push: function s_push(key, ...items) {
            return store.set(key, (store.get(key) as unknown as any[]).concat(items) as unknown as T[keyof T]);
        },

        unshift: function s_unshift(key, ...items) {
            return store.set(key, items.concat(store.get(key)) as unknown as T[keyof T]);
        },

        slice: function s_slice(key, start, end) {
            return store.set(key, (store.get(key) as unknown as any[]).slice(start, end) as unknown as T[keyof T]);
        },

        splice: function s_splice(key: keyof T, start: number, deleteCount: number, ...items: any[]) {
            const arr = (store.get(key) as unknown as any[]).slice();
            _splice.apply(arr, [start, deleteCount].concat(items) as SpliceArgs);
            return store.set(key, arr as unknown as T[keyof T]);
        },

        handle: function s_handle(name, handler) {
            if (handler) {
                handlerMap.set(name, handler.bind(store));
            } else {
                handlerMap.delete(name);
            }
            return this;
        },

        handleSome: function s_handleSome(handlers) {
            _entries(handlers).forEach(pair => {
                store.handle(pair[0] as keyof H, pair[1]);
            });
            return this;
        },

        getHandler: function s_getHandler(name) {
            return handlerMap.get(name);
        },

        trigger: function s_trigger(name, ...args) {
            const handler = handlerMap.get(name);
            if (handler) {
                return handler.apply(store, args);
            }
        }

    };

    return store;

};
