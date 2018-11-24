import { HNode } from "./HNode";
export declare type DeferCallback<A extends any[] = any[]> = (...args: A) => void;
export declare const preDeferCallbacks: DeferCallback<[]>[];
export declare const tick: () => void;
export declare const update: (hNode: HNode<import("./propHandlers").NodeProps, any, any>) => void;
export declare const defer: <A extends any[] = any[]>(callback: DeferCallback<A>, ...args: A) => void;
