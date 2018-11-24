import { HNode, HDesc } from "./HNode";
import { NodeProps } from "./propHandlers";
export declare type HType = string | symbol;
export declare const HUI: {
    <P extends object = NodeProps, S extends object = any, C extends object = any>(type: string | symbol, props?: P | undefined, ...children: unknown[]): HNode<P, S, C>;
    registry: Map<string | symbol, HDesc<any, any, any>>;
    define: <P extends object = NodeProps, S extends object = any, C extends object = any>(type: string | symbol, desc: HDesc<P, S, C>, force?: boolean | undefined) => void;
    createStore: <T extends object = any>(binding?: HNode<any, any, any> | undefined, subscriptions?: (keyof T)[] | undefined, origin?: import("./Store").Store<T> | undefined) => import("./Store").Store<T>;
    propHandlers: Map<string, import("./propHandlers").PropHandler>;
    render: (src: any, parent?: Node, clear?: boolean | undefined, global?: import("./Store").Store<any> | undefined) => void;
    tick(callback: () => void): void;
    frameLimit: number;
    defer: <A extends any[] = any[]>(callback: import("./ticker").DeferCallback<A>, ...args: A) => void;
    Portal: symbol;
    Context: symbol;
};
