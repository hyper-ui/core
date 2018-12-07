import { Store } from "./Store";
import { _document, _isArray, _undefined, _keys } from "./refCache";
import { propHandlers, RefCallback, NodeProps } from "./propHandlers";
import { listen } from "./listen";

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
    parent?: HNode;
    parentNode?: Node;
    output?: unknown[];
    nodes?: Node[];
    active: boolean;
}

export const isHNode = (value: any): value is HNode => value && typeof value === 'object' && value.isHNode;

export const clear = function (hNode: HNode) {

    const { desc, output } = hNode;

    if (desc) {
        if (desc.clear) {
            try {
                desc.clear(hNode.props, hNode.store!, hNode.context!);
            } catch (err) {
                console.error(err);
            }
        }
    } else {
        const { ref } = hNode.props;
        if (ref) {
            (ref as RefCallback)();
        }
    }

    if (output) {
        output.forEach((child: any) => {
            if (isHNode(child) && child.desc) {
                clear(child);
            }
        });
    }

};

export const toNode = function (
    src: unknown, context: Store, parentNode: Node, parent?: HNode
): Node | Node[] {

    const srcType = typeof src;

    if (srcType === 'string') {
        return _document.createTextNode(src as string);
    } else if (srcType === 'number') {
        return _document.createTextNode(String(src));
    }

    if (src && srcType === 'object') {

        if (_isArray(src)) {

            return src.flatMap(s => toNode(s, context, parentNode, parent));

        } else if ((src as any).isHNode) {

            const { type, desc, props, store } = src as HNode;

            (src as HNode).parentNode = parentNode;
            (src as HNode).parent = parent;

            if (!desc) {

                const node = 'xmlns' in props ?
                    _document.createElementNS(props.xmlns!, type as string) :
                    _document.createElement(type as string);

                _keys(props).forEach(key => {

                    const handler = propHandlers.get(key),
                        value = props[key];

                    if (handler) {
                        handler(node, value, context);
                    } else {
                        if (key.startsWith('on')) {
                            listen(node, key.slice(2), value as EventListener);
                        } else if (key in node) {
                            try {
                                // @ts-ignore
                                node[key] = value;
                            } catch {
                                node.setAttribute(key, value as string);
                            }
                        } else {
                            node.setAttribute(key, value as string);
                        }
                    }

                });

                return (src as HNode).nodes = ([] as any[]).concat(node);

            }

            const ctx = context.forward(src as HNode, desc.context);

            (src as HNode).context = ctx;

            try {

                (src as HNode).active = false;

                if (desc.init) {
                    desc.init(props, store!, ctx);
                }

                (src as HNode).output = ([] as any[]).concat(desc.render(props, store!, ctx));

                (src as HNode).active = true;

                return (src as HNode).nodes = ([] as any[]).concat(toNode(
                    (src as HNode).output,
                    ctx,
                    parentNode,
                    src as HNode
                ));

            } catch (err) {

                if (desc.catch) {

                    (src as HNode).output = ([] as any[]).concat(desc.catch(err, props, store!, ctx));

                    (src as HNode).active = true;

                    return (src as HNode).nodes = ([] as any[]).concat(toNode(
                        (src as HNode).output,
                        ctx,
                        parentNode,
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
