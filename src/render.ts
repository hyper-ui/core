import { toNode } from "./HNode";
import { _document, _from } from "./refCache";
import { Store, createStore } from "./Store";
import { toFrag, toArr } from "./utils";

export interface RenderOptions {
    clear?: boolean;
    context?: Store;
    parent?: Node;
}

export const render = function (src: any, options: RenderOptions = {}) {

    const { parent = _document.body } = options;

    if (options.clear) {
        _from(parent.childNodes).forEach(childNode => {
            parent.removeChild(childNode);
        });
    }

    parent.appendChild(
        toFrag(
            toArr(
                toNode(src, options.context || createStore(), parent)
            )
        )
    );

};
