import { toNodeArr, HNode } from "./HNode";
import { _document, _assign, _from } from "../utils/refCache";
import { createStore, Store, HandlerMap, PartialHandlers } from "./Store";
import { toFrag } from "../utils/helpers";
import { DeferCallback, reqTick, willTick } from "../ticker/ticker";

export const renderCallbacks = new Array<DeferCallback<[]>>();

export interface RenderOptions<C extends object = any, H extends HandlerMap<C> = any> {
    clear?: boolean;
    context?: Store<C, H>;
    defaultContext?: Partial<C>;
    contextHandlers?: PartialHandlers<H, Store<C, H>>;
    parent?: Node;
    owner?: HNode<any, any, C>;
    sync?: boolean;
}

export const renderToDOM = function render<C extends object = any, H extends HandlerMap<C> = any>(
    src: any, options: RenderOptions<C, H> = {}
) {

    const { parent = _document.body,
        clear, owner, context = createStore<C, H>(),
        defaultContext, contextHandlers } = options;

    if (defaultContext) {
        context.setSome(defaultContext);
    }
    if (contextHandlers) {
        context.handleSome(contextHandlers);
    }

    if (options.sync) {

        if (clear) {
            _from(parent.childNodes).forEach(childNode => {
                parent.removeChild(childNode);
            });
        }

        parent.appendChild(toFrag(toNodeArr(src, context, parent, owner)));

    } else {

        renderCallbacks.push(() => {
            renderToDOM(src, { parent, owner, clear, context, sync: true });
        });

        if (!willTick) {
            reqTick();
        }

    }

};
