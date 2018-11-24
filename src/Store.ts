import { _Map, _is } from "./refCache";
import { HNode } from "./HNode";
import { update } from "./ticker";

export interface Store<T extends object = any> {
    get<K extends keyof T>(key: K): T[K];
    set<K extends keyof T>(key: K, value: T[K], force?: boolean): this;
    setter<K extends keyof T>(key: K, force?: boolean): (value: T[K]) => void;
    forward(binding?: HNode, subscriptions?: Array<keyof T>): Store<T>;
}

export const createStore = function <T extends object = any>(
    binding?: HNode<any>, subscriptions?: Array<keyof T>, origin?: Store<T>
): Store<T> {

    const map = origin || new _Map(),
        copies = new Array<Store<T>>();

    const store: Store<T> = {

        get(key) {
            return origin ? origin.get(key) : (map as Map<any, any>).get(key);
        },

        set(key, value, force) {

            if (force || !_is(value, store.get(key))) {

                if (origin) {
                    origin.set(key, value);
                } else {
                    (map as Map<any, any>).set(key, value);
                }

                if (binding && binding.active && subscriptions && subscriptions.includes(key)) {
                    update(binding);
                }

                copies.forEach(copy => {
                    copy.set(key, value, true);
                });

            }

            return this;

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
        }

    };

    return store;

}
