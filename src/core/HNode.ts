import { Store, createStore, HandlerMap, PartialHandlers } from "./Store";
import { _document, _isArray, _Infinity, _Map, _entries } from "../utils/refCache";
import { toArr, isHNode } from "../utils/helpers";
import { handleProp } from "./handleProp";
import { handleError } from "./handleError";
import { EleProps } from "./propHandlers";
import { initComponent } from "./initComponent";
import { EventMap } from "./events";

type ArrayWrapped<T> = T extends any[] ? T : [T];

export type HProps<P extends object = EleProps> = Required<{
    [K in keyof P]: K extends 'children' ?
    /**/P extends { children: any } ?
    /******/ArrayWrapped<P['children']> :
    /******/P extends { children?: any } ?
    /**********/ArrayWrapped<P['children']> | undefined :
    /**********/unknown[] :
    /**/P[K];
}> & ('children' extends keyof P ? {} : { children: unknown[] });

export interface HDesc<P extends object = EleProps, S extends object = any, C extends object = any, SH extends HandlerMap<S> = any, CH extends HandlerMap<C> = any> {
    defaultProps?: Partial<P>;
    defaultStore?: Partial<S>;
    storeHandlers?: PartialHandlers<SH, Store<S>>;
    state?: Array<keyof S>;
    context?: Array<keyof C>;
    init?: (this: HNode<P, S, C>, props: HProps<P>, store: Store<S, SH>, context: Store<C, CH>) => void;
    render: (this: HNode<P, S, C>, props: HProps<P>, store: Store<S, SH>, context: Store<C, CH>) => unknown;
    clear?: (this: HNode<P, S, C>, props: HProps<P>, store: Store<S, SH>, context: Store<C, CH>) => void;
    catch?: (this: HNode<P, S, C>, err: any, props: HProps<P>, store: Store<S, SH>, context: Store<C, CH>) => unknown;
}

export interface HNode<P extends object = EleProps, S extends object = any, C extends object = any, SH extends HandlerMap<S> = any, CH extends HandlerMap<C> = any> {
    isHNode: true;
    type: unknown;
    desc?: HDesc<P, S, C, SH, CH>;
    props: HProps<P>;
    store?: Store<S, SH>;
    context?: Store<C, CH>;
    owner?: HNode<any>;
    ownerNode?: Node;
    output?: unknown[];
    nodes?: Node[];
    active: boolean;
    events?: EventMap;
    error?: unknown;
}

export const toNodeArr = function toNodes(
    src: unknown, context: Store, ownerNode: Node, owner?: HNode<any>
): Node[] {

    const srcType = typeof src;

    if (srcType === 'string') {
        return [_document.createTextNode(src as string)];
    } else if (srcType === 'number') {
        return [_document.createTextNode(String(src))];
    }

    if (src) {

        if (_isArray(src) && src.length) {

            return src.flat(_Infinity).map(s => toNodeArr(s, context, ownerNode, owner)).flat();

        } else if (isHNode(src)) {

            const { type, desc } = src;

            src.ownerNode = ownerNode;
            src.owner = owner;

            if (desc) {

                const store = createStore();

                try {

                    src.active = false;

                    initComponent(src, store, context);

                    return src.nodes = toNodeArr(
                        src.output = toArr(
                            desc.render.call(src, src.props, store, context)
                        ).flat(_Infinity),
                        context,
                        ownerNode,
                        src
                    );

                } catch (err) {

                    if (desc.catch) {
                        return src.nodes = toNodeArr(
                            src.output = toArr(
                                desc.catch.call(src, err, src.props, store, context)
                            ).flat(_Infinity),
                            context,
                            ownerNode,
                            src
                        );
                    } else {
                        handleError(err, src);
                    }

                } finally {
                    src.active = true;
                }

            } else {

                const { props } = src;

                src.events = new _Map();

                const element = props.xmlns ?
                    _document.createElementNS(props.xmlns, type as string) :
                    _document.createElement(type as string);

                _entries(props).forEach(pair => {
                    handleProp(element, src, pair[0], pair[1]);
                });

                src.output = [];
                src.nodes = [element];

                return [element];

            }
        }

    }

    return [_document.createTextNode('')];

};
