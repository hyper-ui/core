import { _isArray, _keys, _assign, _Boolean, _Map } from "./refCache";
import { Store } from "./Store";
import { render } from "./render";

export type PropHandler = (node: Node, value: any, context: Store) => void;

export type RefCallback = (node?: Node) => void;

export interface AttributeMap {
    [key: string]: string;
}

export interface NodeProps {
    xmlns?: string;
    style?: string | { [key: string]: string };
    class?: string | any[];
    ref?: RefCallback;
    attr?: AttributeMap;
    [key: string]: unknown;
}

export const propHandlers = new _Map<string, PropHandler>([

    ['children', function (node, children, context) {
        render(children, node, true, context);
    }],

    ['style', function (node, style) {
        if (style && typeof style === 'object') {
            _assign((node as HTMLElement).style, style);
        } else {
            try {
                // @ts-ignore
                (node as HTMLElement).style = style;
            } catch {
                (node as Element).setAttribute('style', style);
            }
        }
    }],

    ['class', function (node, classes) {
        (node as Element).setAttribute(
            'class',
            _isArray(classes) ? (classes as any[]).filter(_Boolean).join(' ') : classes
        );
    }],

    ['ref', function (node, ref: RefCallback) {
        ref(node);
    }],

    ['attributes', function (node, attributes: AttributeMap) {
        _keys(attributes).forEach(key => {
            (node as Element).setAttribute(key, attributes[key]);
        });
    }]

]);
