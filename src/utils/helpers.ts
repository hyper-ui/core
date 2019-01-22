import { _isArray, _document, _is, _keys, _Node, _console, _hasOwnProperty } from "./refCache";
import { HNode } from "../core/HNode";

export const toArr = <T>(a: T): T extends any[] ? T : [T] =>
    (_isArray(a) ? a : [a]) as T extends any[] ? T : [T];

export const toFrag = (nodes: Node[]) => nodes.reduce(
    (frag, node) => (frag.appendChild(node), frag),
    _document.createDocumentFragment()
);

export const isHNode = function isHN(value: unknown): value is HNode<any> {
    return value && isObject(value) && (value as HNode<any>).isHN;
}

export const replaceNodes = function replNodes(ownerNode: Node, oldNodes: Node[], newNodes: Node[]) {
    oldNodes.forEach((oldNode, i) => {
        if (i) {
            ownerNode.removeChild(oldNode);
        } else {
            ownerNode.replaceChild(toFrag(newNodes), oldNode);
        }
    });
};

export const inherit = function (target: HNode<any>, source: HNode<any>) {

    target.nodes = source.nodes;
    target.owner = source.owner;
    target.ownNode = source.ownNode;
    target.ctx = source.ctx;
    target.sto = source.sto;

    if (source.desc) {
        target.out = source.out;
    } else {
        target.evMap = source.evMap;
    }

};

export type SpliceArgs<T = any> = [number, number, ...T[]];

export const supply = function <T extends object = any>(target: T, defaults: T) {
    _keys(defaults).forEach(key => {
        if (!_hasOwnProperty.call(target, key)) {
            (target as any)[key] = (defaults as any)[key];
        }
    });
};

export const isObject = function isObj(value: unknown): value is object {
    return typeof value === 'object';
};
