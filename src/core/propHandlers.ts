import { _isArray, _assign, _Boolean, _Map, _entries } from "../utils/refCache";
import { HNode } from "./HNode";
import { updateChildren } from "../ticker/updateChildren";
import { isObject } from "../utils/helpers";

export type PropHandler<T = unknown> =
    (element: Element, newValue: T, oldValue: T | undefined, hNode: HNode<any>) => void;

export type RefCallback<T extends Element = Element> = (element?: T) => void;

export interface AttributeMap {
    [key: string]: string;
}

export interface EleProps<T extends Element = Element> {
    xmlns?: string;
    style?: string | { [key: string]: string };
    class?: string | any[];
    ref?: RefCallback<T>;
    attr?: AttributeMap;
    prop?: Partial<T>;
    [key: string]: unknown;
}

export const propHandlers = new _Map<string, PropHandler<any>>([

    ['children', function chdHandler(
        element, newChildren: unknown[], oldChildren: unknown[] | undefined, hNode
    ) {
        updateChildren(element, hNode, newChildren, oldChildren || []);
    }],

    ['style', function styHandler(element, style) {
        type HTMLElementOrSVG = HTMLElement | SVGSVGElement;
        if (style && isObject(style)) {
            _assign((element as HTMLElementOrSVG).style, style);
        } else {
            try {
                ((element as HTMLElementOrSVG).style as any) = style;
            } catch {
                element.setAttribute('style', style);
            }
        }
    }],

    ['class', function clsHandler(element, classes) {
        element.setAttribute(
            'class',
            _isArray(classes) ?
                classes.filter(_Boolean).join(' ') :
                classes
        );
    }],

    ['ref', function refHandler(element, callback: RefCallback) {
        callback(element);
    }],

    ['attr', function attrHandler(element, attributes: AttributeMap) {
        _entries(attributes).forEach(pair => {
            element.setAttribute(pair[0], pair[1]);
        });
    }],

    ['prop', function propHandler(element, properties: Partial<HTMLElement>) {
        _assign(element, properties);
    }]

]);
