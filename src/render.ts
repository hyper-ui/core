import { toNode } from "./HNode";
import { _isArray, _document } from "./refCache";
import { Store, createStore } from "./Store";
import { toFrag } from "./utils";

export const render = function (src: any, parent: Node = _document.body, clear?: boolean, global?: Store) {

    const nodes = toNode(src, global || createStore(), parent);

    if (clear) {
        parent.childNodes.forEach((childNode) => {
            parent.removeChild(childNode);
        });
    }

    parent.appendChild(_isArray(nodes) ? toFrag(nodes) : nodes);

};
