import { _isArray, _keys, _assign, _Boolean, _Map } from "./refCache";
import { render } from "./render";
import { HNode } from "./HNode";

export type PropHandler = (node: Node, value: any, hNode: HNode<any>) => void;

export type RefCallback = (node?: Node) => void;

export interface AttributeMap {
    [key: string]: string;
}

export const propHandlers = new _Map<string, PropHandler>([

    ['children', function (node, children, hNode) {
        render(children, {
            parent: node,
            owner: hNode,
            context: hNode.context!,
            clear: true
        });
    }],

    ['style', function (node, style) {
        if (style && typeof style === 'object') {
            _assign((node as HTMLElement).style, style);
        } else {
            try {
                ((node as HTMLElement).style as any) = style;
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

    ['attr', function (node, attributes: AttributeMap) {
        _keys(attributes).forEach(key => {
            (node as Element).setAttribute(key, attributes[key]);
        });
    }]

]);
