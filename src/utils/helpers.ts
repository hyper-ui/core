import { _isArray, _document, _is, _keys, _Node, _console } from "./refCache";
import { HNode } from "../core/HNode";
import { EleProps } from "../core/propHandlers";

export const toArr = <T>(a: T): T extends any[] ? T : [T] =>
    (_isArray(a) ? a : [a]) as T extends any[] ? T : [T];

export const toFrag = (nodes: Node[]) => nodes.reduce(
    (frag, node) => (frag.appendChild(node), frag),
    _document.createDocumentFragment()
);

export const isHNode = (value: unknown): value is HNode<any> =>
    value && typeof value === 'object' && (value as any).isHNode;

export const replaceNodes = function (ownerNode: Node, oldNodes: Node[], newNodes: Node[]) {
    oldNodes.forEach((oldNode, i) => {
        if (i) {
            ownerNode.removeChild(oldNode);
        } else {
            ownerNode.replaceChild(toFrag(newNodes), oldNode);
        }
    });
};

export const inherit = function (target: HNode<EleProps>, source: HNode<EleProps>) {

    target.nodes = source.nodes;
    target.owner = source.owner;
    target.ownerNode = source.ownerNode;
    target.context = source.context;
    target.store = source.store;

    if (source.desc) {
        target.output = source.output;
    } else {
        target.events = source.events;
    }

};

export type SpliceArgs<T = any> = [number, number, ...T[]];
