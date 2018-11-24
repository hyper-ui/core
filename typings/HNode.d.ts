import { HType } from "./HUI";
import { Store } from "./Store";
import { NodeProps } from "./propHandlers";
export declare type HProps<P extends object = NodeProps> = P & {
    children: HNode[];
};
export interface HDesc<P extends object = NodeProps, S extends object = any, C extends object = any> {
    state?: Array<keyof S>;
    context?: Array<keyof C>;
    init?: (this: void, props: HProps<P>, store: Store<S>, context: Store<C>) => void;
    render: (this: void, props: HProps<P>, store: Store<S>, context: Store<C>) => any;
    clear?: (this: void, props: HProps<P>, store: Store<S>, context: Store<C>) => void;
    catch?: (this: void, err: any, props: HProps<P>, store: Store<S>, context: Store<C>) => any;
}
export interface HNode<P extends object = NodeProps, S extends object = any, C extends object = any> {
    isHNode: true;
    type: HType;
    desc?: HDesc<P, S, C>;
    props: HProps<P>;
    store?: Store<S>;
    context?: Store<C>;
    parent?: HNode;
    parentNode?: Node;
    output?: any;
    nodes?: Node | Node[];
    active: boolean;
}
export declare const isHNode: (value: any) => value is HNode<NodeProps, any, any>;
export declare const clear: (hNode: HNode<NodeProps, any, any>) => void;
export declare const toNode: (src: unknown, context: Store<any>, parentNode: Node, parent?: HNode<NodeProps, any, any> | undefined) => Node | Node[];
