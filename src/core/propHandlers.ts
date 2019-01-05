import { _isArray, _keys, _assign, _Boolean, _Map } from "../utils/refCache";
import { HNode } from "./HNode";
import { updateChildren } from "./updateChildren";

export type PropHandler<T = unknown> =
    (element: HTMLElement, newValue: T, oldValue: T | undefined, hNode: HNode<any>) => void;

export type RefCallback<T extends HTMLElement = HTMLElement> = (node?: T) => void;

export interface AttributeMap {
    [key: string]: string;
}

export const noCmpProps = ['children'];

export const propHandlers = new _Map<string, PropHandler<any>>([

    ['children', function (element, newChildren: unknown[], oldChildren: unknown[] | undefined, hNode) {
        updateChildren(element, hNode, newChildren, oldChildren || []);
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
