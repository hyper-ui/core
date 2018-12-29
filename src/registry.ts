import { HDesc, NodeProps } from "./HNode";
import { _String, _Map } from "./refCache";

export const registry = new _Map<any, HDesc<any>>();

type obj = object;

export const define = function d<P extends obj = NodeProps, S extends obj = any, C extends obj = any>(
    type: unknown, desc: HDesc<P, S, C>, force?: boolean
) {

    if (!force && registry.has(type)) {

        throw `"${_String(type)}" has been defined`;

    } else {

        registry.set(type, desc);

    }

};
