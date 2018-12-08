import { Store } from "./Store";
import { _document, _isArray, _undefined, _keys, _Map } from "./refCache";
import { RefCallback, AttributeMap } from "./propHandlers";
import { toArr, isHNode } from "./utils";
import { handleProp } from "./handleProp";

export interface NodeProps {
    xmlns?: string;
    style?: string | { [key: string]: string };
    class?: string | any[];
    ref?: RefCallback;
    attr?: AttributeMap;
    [key: string]: unknown;
}

export type HProps<P extends object = NodeProps> = P & {
    children: HNode[];
};

export interface HDesc<P extends object = NodeProps, S extends object = any, C extends object = any> {
    state?: Array<keyof S>;
    context?: Array<keyof C>;
    init?: (this: void, props: HProps<P>, store: Store<S>, context: Store<C>) => void;
    render: (this: void, props: HProps<P>, store: Store<S>, context: Store<C>) => unknown;
    clear?: (this: void, props: HProps<P>, store: Store<S>, context: Store<C>) => void;
    catch?: (this: void, err: any, props: HProps<P>, store: Store<S>, context: Store<C>) => unknown;
}

export type EventRecord = [string, EventListener, boolean | AddEventListenerOptions];
export type EventMap = Map<string, EventRecord>;

export interface HNode<P extends object = NodeProps, S extends object = any, C extends object = any> {
    isHNode: true;
    type: unknown;
    desc?: HDesc<P, S, C>;
    props: HProps<P>;
    store?: Store<S>;
    context?: Store<C>;
    owner?: HNode;
    ownerNode?: Node;
    output?: unknown[];
    nodes?: Node[];
    active: boolean;
    events?: EventMap;
}

export const toNode = function (
    src: unknown, context: Store, ownerNode: Node, owner?: HNode
): Node | Node[] {

    const srcType = typeof src;

    if (srcType === 'string') {
        return _document.createTextNode(src as string);
    } else if (srcType === 'number') {
        return _document.createTextNode(String(src));
    }

    if (src) {

        if (_isArray(src) && src.length) {

            return src.flatMap(s => toNode(s, context, ownerNode, owner));

        } else if (isHNode(src)) {

            const { type, desc, props, store } = src as HNode;

            (src as HNode).ownerNode = ownerNode;
            (src as HNode).owner = owner;

            if (!desc) {

                const node = props.xmlns ?
                    _document.createElementNS(props.xmlns, type as string) :
                    _document.createElement(type as string),
                    events = src.events = new _Map();

                _keys(props).forEach(key => {
                    handleProp(node, key, props[key], context, events);
                });

                return (src as HNode).nodes = toArr(node);

            }

            const ctx = context.forward(src as HNode, desc.context);

            (src as HNode).context = ctx;

            try {

                (src as HNode).active = false;

                if (desc.init) {
                    desc.init(props, store!, ctx);
                }

                return (src as HNode).nodes = toArr(toNode(
                    (src as HNode).output = toArr(desc.render(props, store!, ctx)),
                    ctx,
                    ownerNode,
                    src as HNode
                ));

            } catch (err) {

                if (desc.catch) {
                    return (src as HNode).nodes = toArr(toNode(
                        (src as HNode).output = toArr(desc.catch(err, props, store!, ctx)),
                        ctx,
                        ownerNode,
                        src as HNode
                    ));
                } else {
                    throw err;
                }

            } finally {

                (src as HNode).active = true;

            }

        }

    }

    return _document.createTextNode('');

};
