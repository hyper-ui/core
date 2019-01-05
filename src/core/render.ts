import { toNodes, HNode } from "./HNode";
import { _document, _assign, _from } from "../utils/refCache";
import { Store, createStore } from "./Store";
import { toFrag } from "../utils/helpers";
import { DeferCallback, reqTick } from "./ticker";

export const renderCallbacks = new Array<DeferCallback<[]>>();

export interface RenderOptions {
    clear?: boolean;
    context?: Store;
    parent?: Node;
    owner?: HNode<any>;
    sync?: boolean;
}

export const render = function (src: any, options: RenderOptions = {}) {

    const { parent = _document.body, context = createStore(), clear, owner } = options;

    if (options.sync) {

        if (clear) {
            _from(parent.childNodes).forEach(childNode => {
                parent.removeChild(childNode);
            });
        }

        parent.appendChild(toFrag(toNodes(src, context, parent, owner)));

    } else {

        renderCallbacks.push(() => {
            render(src, { parent, owner, context, clear, sync: true });
        });

        reqTick();

    }

};