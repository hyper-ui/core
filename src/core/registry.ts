import { HDesc, ElementProps } from "./HNode";
import { _Map, _Symbol } from "../utils/refCache";
import { Store } from "./Store";

export const registry = new _Map<HType<any> | string, HDesc<any>>();

type obj = object;

export interface HType<P extends obj = ElementProps, S extends obj = any, C extends obj = any> {
    (props: P, store: Store<S>, context: Store<C>): unknown;
};

export const define = function <P extends obj = ElementProps, S extends obj = any, C extends obj = any>(
    name: string, desc: HDesc<P, S, C>
): HType<P, S, C> {

    const type = _Symbol(name) as unknown as HType<P, S, C>;

    registry.set(type, desc);

    return type;

};
