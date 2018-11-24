import { toNode } from "./HNode";
import { _isArray, _document } from "./refCache";
import { Store, createStore } from "./Store";

export const render = function (src: any, parent: Node = _document.body, clear?: boolean, global?: Store) {

    const nodes = toNode(src, global || createStore(), parent);

    let newNode: Node;

    if (_isArray(nodes)) {
        newNode = _document.createDocumentFragment();
        nodes.forEach(node => {
            newNode.appendChild(node);
        });
    } else {
        newNode = nodes;
    }

    if (clear) {
        parent.childNodes.forEach((childNode, i) => {
            if (i > 0) {
                parent.removeChild(childNode);
            } else {
                parent.replaceChild(newNode, childNode);
            }
        });
    } else {
        parent.appendChild(newNode);
    }

};
