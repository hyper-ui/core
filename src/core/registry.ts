import { HDesc } from "./HNode";
import { _Map, _Symbol } from "../utils/refCache";
import { Store, HandlerMap } from "./Store";

export interface HType<P extends object = any, S extends object = any, C extends object = any, SH extends HandlerMap<S> = any, CH extends HandlerMap<C> = any> {
    (props: P, store: Store<S, SH>, context: Store<C, CH>): any;
};

export const registry = new _Map<HType<any> | string, HDesc<any>>();

export const define = function <
    P extends object = any,
    S extends object = any,
    C extends object = any,
    SH extends HandlerMap<S> = any,
    CH extends HandlerMap<C> = any
>(name: string, desc: HDesc<P, S, C, SH, CH>): HType<P, S, C, SH, CH> {

    const type = _Symbol(name) as unknown as HType<P, S, C, SH, CH>;

    registry.set(type, desc);

    return type;

};
