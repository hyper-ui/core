import { HDesc, NodeProps } from "./HNode";
import { _String, _Map } from "./refCache";

export const registry = new _Map<any, HDesc<any>>();

export const define = function <P extends object = NodeProps, S extends object = any, C extends object = any>(
    type: unknown, desc: HDesc<P, S, C>, force?: boolean
) {

    if (!force && registry.has(type)) {

        throw `"${_String(type)}" has been defined`;

    } else {

        registry.set(type, desc);

    }

};
