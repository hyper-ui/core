import { Store } from "./Store";
export declare type PropHandler = (node: Node, value: any, context: Store) => void;
export declare type RefCallback = (node?: Node) => void;
export interface AttributeMap {
    [key: string]: string;
}
export interface NodeProps {
    xmlns?: string;
    style?: string | {
        [key: string]: string;
    };
    class?: string | any[];
    ref?: RefCallback;
    attr?: AttributeMap;
    [key: string]: unknown;
}
export declare const propHandlers: Map<string, PropHandler>;
