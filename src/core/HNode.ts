import { Store } from "./Store";
import { _document, _isArray, _keys, _Infinity } from "../utils/refCache";
import { RefCallback, AttributeMap } from "./propHandlers";
import { toArr, isHNode } from "../utils/helpers";
import { handleProp } from "./handleProp";
import { handleError } from "./handleError";

export interface ElementProps<T extends HTMLElement = HTMLElement> {
    xmlns?: string;
    style?: string | { [key: string]: string };
    class?: string | any[];
    ref?: RefCallback<T>;
    attr?: AttributeMap;
    [key: string]: unknown;
}

export type HProps<P extends object = ElementProps> = P & {
    children: unknown[];
};

export interface HDesc<P extends object = ElementProps, S extends object = any, C extends object = any> {
    state?: Array<keyof S>;
    context?: Array<keyof C>;
    init?: (this: HNode<P, S, C>, props: HProps<P>, store: Store<S>, context: Store<C>) => void;
    render: (this: HNode<P, S, C>, props: HProps<P>, store: Store<S>, context: Store<C>) => unknown;
    clear?: (this: HNode<P, S, C>, props: HProps<P>, store: Store<S>, context: Store<C>) => void;
    catch?: (this: HNode<P, S, C>, err: any, props: HProps<P>, store: Store<S>, context: Store<C>) => unknown;
}

export type EventRecord = [string, EventListener, boolean | AddEventListenerOptions];
export type EventMap = Map<string, EventRecord>;

export interface HNode<P extends object = ElementProps, S extends object = any, C extends object = any> {
    isHNode: true;
    type: unknown;
    desc?: HDesc<P, S, C>;
    props: HProps<P>;
    store?: Store<S>;
    context?: Store<C>;
    owner?: HNode<any>;
    ownerNode?: Node;
    output?: unknown[];
    nodes?: Node[];
    active: boolean;
    events?: EventMap;
    error?: unknown;
}

export const toNodes = function (
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

            return src.flat(_Infinity).map(s => toNodes(s, context, ownerNode, owner)).flat();

        } else if (isHNode(src)) {

            const { type, desc, props, store } = src;

            src.ownerNode = ownerNode;
            src.owner = owner;

            if (desc) {

                src.context = context;

                if (desc.context) {
                    context.bind(src, desc.context);
                }

                try {

                    src.active = false;

                    if (desc.init) {
                        desc.init.call(src, props, store!, context);
                    }

                    return src.nodes = toNodes(
                        src.output = toArr(
                            desc.render.call(src, props, store!, context)
                        ).flat(_Infinity),
                        context,
                        ownerNode,
                        src
                    );

                } catch (err) {

                    if (desc.catch) {
                        return src.nodes = toNodes(
                            src.output = toArr(
                                desc.catch.call(src, err, props, store!, context)
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

                const node = props.xmlns ?
                    _document.createElementNS(props.xmlns, type as string) :
                    _document.createElement(type as string);

                _keys(props).forEach(key => {
                    handleProp(node, src, key, props[key]);
                });

                src.output = [];
                src.nodes = [node];

                return [node];

            }
        }

    }

    return [_document.createTextNode('')];

};
