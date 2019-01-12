import { HDesc } from "./HNode";
import { _Map, _Symbol } from "../utils/refCache";
import { Store } from "./Store";
import { EleProps } from "./propHandlers";

export interface HType<P extends object = EleProps, S extends object = any, C extends object = any> {
    (props: P, store: Store<S>, context: Store<C>): any;
};

export const registry = new _Map<HType<any> | string, HDesc<any>>();

export const define = function <P extends object = EleProps, S extends object = any, C extends object = any>(
    name: string, desc: HDesc<P, S, C>
): HType<P, S, C> {

    const type = _Symbol(name) as unknown as HType<P, S, C>;

    registry.set(type, desc);

    return type;

};
