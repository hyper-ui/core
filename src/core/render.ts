import { toNodes, HNode } from "./HNode";
import { _document, _assign, _from } from "../utils/refCache";
import { createStore, Store } from "./Store";
import { toFrag } from "../utils/helpers";
import { DeferCallback, reqTick } from "../ticker/ticker";

export const renderCallbacks = new Array<DeferCallback<[]>>();

export interface RenderOptions<C extends object = any> {
    clear?: boolean;
    context?: Store<C>;
    defaultContext?: Partial<C>;
    parent?: Node;
    owner?: HNode<any, any, C>;
    sync?: boolean;
}

export const render = function <C extends object = any>(src: any, options: RenderOptions<C> = {}) {

    const { parent = _document.body, clear, owner, context = createStore(), defaultContext } = options;

    if (defaultContext) {
        context.setSome(defaultContext);
    }

    if (options.sync) {

        if (clear) {
            _from(parent.childNodes).forEach(childNode => {
                parent.removeChild(childNode);
            });
        }

        parent.appendChild(toFrag(toNodes(src, context, parent, owner)));

    } else {

        renderCallbacks.push(() => {
            render(src, { parent, owner, clear, context, sync: true });
        });

        reqTick();

    }

};
