import { Store, createStore, HandlerMap, PartialHandlers } from "./Store";
import { _document, _isArray, _Infinity, _Map, _entries, _createTextNode } from "../utils/refCache";
import { toArr, isHNode } from "../utils/helpers";
import { handleProp } from "./handleProp";
import { handleError } from "./handleError";
import { EleProps } from "./propHandlers";
import { initComponent } from "./initComponent";
import { EventMap } from "./events";

type ArrayWrapped<T> = T extends any[] ? T : [T];

export type HProps<P extends object = any, DP extends Partial<P> = {}> = {
    [K in keyof P]-?: K extends 'children' ? (
        P extends { children: any } ? (
            ArrayWrapped<P['children']>
        ) : (
            P extends { children?: any } ? (
                ArrayWrapped<P['children']> | undefined
            ) : (
                unknown[]
            )
        )
    ) : (
        K extends keyof DP ? (
            Exclude<P[K], undefined>
        ) : (
            P[K] | undefined
        )
    );
} & ('children' extends keyof P ? {} : {
    children: unknown[];
});

export interface HDesc<P extends object = any, S extends object = any, C extends object = any, SH extends HandlerMap<S> = any, CH extends HandlerMap<C> = any, DP extends Partial<P> = {}> {
    defaultProps?: DP;
    defaultStore?: Partial<S>;
    storeHandlers?: PartialHandlers<SH, Store<S>>;
    state?: Array<keyof S>;
    context?: Array<keyof C>;
    init?: (this: HNode<P, S, C, SH, CH, DP>, props: HProps<P, DP>, store: Store<S, SH>, context: Store<C, CH>) => void;
    render: (this: HNode<P, S, C, SH, CH, DP>, props: HProps<P, DP>, store: Store<S, SH>, context: Store<C, CH>) => unknown;
    clear?: (this: HNode<P, S, C, SH, CH, DP>, props: HProps<P, DP>, store: Store<S, SH>, context: Store<C, CH>) => void;
    catch?: (this: HNode<P, S, C, SH, CH, DP>, err: any, props: HProps<P, DP>, store: Store<S, SH>, context: Store<C, CH>) => unknown;
}

export interface HNode<P extends object = EleProps, S extends object = any, C extends object = any, SH extends HandlerMap<S> = any, CH extends HandlerMap<C> = any, DP extends Partial<P> = {}> {
    isHN: true;
    type: unknown;
    desc?: HDesc<P, S, C, SH, CH, DP>;
    props: HProps<P, DP>;
    sto?: Store<S, SH>;
    ctx?: Store<C, CH>;
    owner?: HNode<any>;
    ownNode?: Node;
    out?: unknown[];
    nodes?: Node[];
    active: boolean;
    evMap?: EventMap;
    err?: unknown;
}

export const toNodeArr = function toNodes(
    src: unknown, context: Store, ownerNode: Node, owner?: HNode<any>
): Node[] {

    const srcType = typeof src;

    if (srcType === 'string') {
        return [_createTextNode(src as string)];
    } else if (srcType === 'number') {
        return [_createTextNode(String(src))];
    }

    if (src) {

        if (_isArray(src) && src.length) {

            return src.flat(_Infinity).map(s => toNodeArr(s, context, ownerNode, owner)).flat();

        } else if (isHNode(src)) {

            const { type, desc } = src;

            src.ownNode = ownerNode;
            src.owner = owner;
            src.ctx = context;

            if (desc) {

                const store = createStore();

                try {

                    src.active = false;

                    initComponent(src, store);

                    return src.nodes = toNodeArr(
                        src.out = toArr(
                            desc.render.call(src, src.props, store, context)
                        ).flat(_Infinity),
                        context,
                        ownerNode,
                        src
                    );

                } catch (err) {

                    if (desc.catch) {
                        return src.nodes = toNodeArr(
                            src.out = toArr(
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

                src.evMap = new _Map();

                const element = props.xmlns ?
                    _document.createElementNS(props.xmlns, type as string) :
                    _document.createElement(type as string);

                _entries(props).forEach(pair => {
                    handleProp(element, src, pair[0], pair[1]);
                });

                src.out = [];
                src.nodes = [element];

                return [element];

            }
        }

    }

    return [_createTextNode('')];

};
