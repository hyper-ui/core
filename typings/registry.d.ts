import { HDesc } from "./HNode";
import { NodeProps } from "./propHandlers";
export declare const registry: Map<string | symbol, HDesc<any, any, any>>;
export declare const define: <P extends object = NodeProps, S extends object = any, C extends object = any>(type: string | symbol, desc: HDesc<P, S, C>, force?: boolean | undefined) => void;
