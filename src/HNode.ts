import { Store } from "./Store";
import { _document, _isArray, _undefined, _keys } from "./refCache";
import { NodeProps } from "./propHandlers";
import { toArr } from "./utils";
import { handleProp } from "./handleProp";

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

    if (src && srcType === 'object') {

        if (_isArray(src) && src.length) {

            return src.flatMap(s => toNode(s, context, ownerNode, owner));

        } else if ((src as any).isHNode) {

            const { type, desc, props, store } = src as HNode;

            (src as HNode).ownerNode = ownerNode;
            (src as HNode).owner = owner;

            if (!desc) {

                const node = 'xmlns' in props ?
                    _document.createElementNS(props.xmlns!, type as string) :
                    _document.createElement(type as string);

                _keys(props).forEach(key => {
                    handleProp(node, key, props[key], context);
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

                (src as HNode).output = toArr(desc.render(props, store!, ctx));

                (src as HNode).active = true;

                return (src as HNode).nodes = toArr(toNode(
                    (src as HNode).output,
                    ctx,
                    ownerNode,
                    src as HNode
                ));

            } catch (err) {

                if (desc.catch) {

                    (src as HNode).output = toArr(desc.catch(err, props, store!, ctx));

                    (src as HNode).active = true;

                    return (src as HNode).nodes = toArr(toNode(
                        (src as HNode).output,
                        ctx,
                        ownerNode,
                        src as HNode
                    ));

                } else {

                    throw err;

                }

            }

        }

    }

    return _document.createTextNode('');

};
