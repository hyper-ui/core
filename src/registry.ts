import { HType } from "./HUI";
import { HDesc } from "./HNode";
import { _String, _Map } from "./refCache";
import { NodeProps } from "./propHandlers";

export const registry = new _Map<HType, HDesc<any>>();

export const define = function <P extends object = NodeProps, S extends object = any, C extends object = any>(
    type: HType, desc: HDesc<P, S, C>, force?: boolean
) {

    if (!force && registry.has(type)) {

        throw `"${_String(type)}" has been defined`;

    } else {

        registry.set(type, desc);

    }

};
