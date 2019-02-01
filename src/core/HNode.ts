import { Store, createStore, StoreType, StoreHandlers, HandlerMap } from "./Store";
import { _document, _isArray, _Infinity, _Map, _entries, _createTextNode } from "../utils/refCache";
import { toArr, isHNode } from "../utils/helpers";
import { handleProp } from "./handleProp";
import { handleError } from "./handleError";
import { EleProps } from "./propHandlers";
import { initComponent } from "./initComponent";
import { EventMap } from "./events";

type ArrayWrapped<T> = T extends any[] ? T : [T];

export type HProps<P extends object = any> = {
    [K in keyof P]: K extends 'children' ? (
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
        P[K]
    );
} & ('children' extends keyof P ? {} : {
    children: unknown[];
});

export type HCallback<P extends object = any, S extends Store = Store, C extends Store = Store, T = unknown> =
    (this: HNode<P, S, C>, props: HProps<P>, store: S, context: C) => T;

export type EffectCallback<P extends object = any, S extends Store = Store, C extends Store = Store> =
    HCallback<P, S, C, (() => void) | void>;

export interface HDesc<P extends object = any, S extends Store = Store, C extends Store = Store> {
    defaultProps?: Partial<P>;
    defaultStore?: Partial<StoreType<S>>;
    storeHandlers?: Partial<HandlerMap<StoreType<S>, StoreHandlers<S>>>;
    effects?: EffectCallback<P, S, C>[];
    state?: Array<keyof StoreType<S>>;
    context?: Array<keyof StoreType<C>>;
    init?: HCallback<P, S, C, void>;
    render: HCallback<P, S, C, unknown>;
    clear?: HCallback<P, S, C, void>;
    catch?: (this: HNode<P, S, C>, err: any, props: HProps<P>, store: S, context: C) => unknown;
}

export interface HNode<P extends object = EleProps, S extends Store = Store, C extends Store = Store> {
    isHN: true;
    type: unknown;
    desc?: HDesc<P, S, C>;
    props: HProps<P>;
    sto?: S;
    ctx?: C;
    owner?: HNode<any>;
    ownNode?: Node;
    out?: unknown[];
    nodes?: Node[];
    active: boolean;
    evMap?: EventMap;
    eff?: (() => void)[];
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

            return src.flat(_Infinity).flatMap(s => toNodeArr(s, context, ownerNode, owner));

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
