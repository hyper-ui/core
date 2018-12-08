import { _isArray, _document } from "./refCache";

export const toArr = <T>(a: T): T extends any[] ? T : [T] =>
    (_isArray(a) ? a : [a]) as T extends any[] ? T : [T];

export const toFrag = (nodes: Node[]) =>
    nodes.reduce((frag, node) => (frag.appendChild(node), frag), _document.createDocumentFragment());
