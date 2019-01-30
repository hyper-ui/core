import { HDesc } from "./HNode";
import { _Map, _Symbol } from "../utils/refCache";
import { Store } from "./Store";

export interface HType<P extends object = any, S extends Store = Store, C extends Store = Store> {
    (props: P, store: S, context: C): any;
};

export const registry = new _Map<HType<any> | string, HDesc<any>>();

export const define = function <P extends object = any, S extends Store = Store, C extends Store = Store>(
    name: string, desc: HDesc<P, S, C>
): HType<P, S, C> {

    const type = _Symbol(name) as unknown as HType<P, S, C>;

    registry.set(type as HType, desc as HDesc);

    return type;

};
