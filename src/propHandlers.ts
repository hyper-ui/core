import { _isArray, _keys, _assign, _Boolean, _Map } from "./refCache";
import { render } from "./render";
import { HNode } from "./HNode";

export type PropHandler = (element: HTMLElement, value: any, hNode: HNode<any>) => void;

export type RefCallback<T extends HTMLElement = HTMLElement> = (node?: T) => void;

export interface AttributeMap {
    [key: string]: string;
}

export const propHandlers = new _Map<string, PropHandler>([

    ['children', function (element, children, hNode) {
        render(children, {
            parent: element,
            owner: hNode,
            context: hNode.context!,
            clear: true
        });
    }],

    ['style', function (element, style) {
        if (style && typeof style === 'object') {
            _assign(element.style, style);
        } else {
            try {
                (element.style as any) = style;
            } catch {
                element.setAttribute('style', style);
            }
        }
    }],

    ['class', function (element, classes) {
        element.setAttribute(
            'class',
            _isArray(classes) ? (classes as any[]).filter(_Boolean).join(' ') : classes
        );
    }],

    ['ref', function (element, ref: RefCallback) {
        ref(element);
    }],

    ['attr', function (element, attributes: AttributeMap) {
        _keys(attributes).forEach(key => {
            element.setAttribute(key, attributes[key]);
        });
    }]

]);
