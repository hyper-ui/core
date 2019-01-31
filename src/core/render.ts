import { toNodeArr, HNode } from "./HNode";
import { _document, _assign, _from } from "../utils/refCache";
import { createStore, Store, StoreType, StoreHandlers, HandlerMap } from "./Store";
import { toFrag } from "../utils/helpers";
import { DeferCallback, reqTick, willTick } from "../ticker/ticker";

export const renderCallbacks = new Array<DeferCallback<[]>>();

export interface RenderOptions<C extends Store = Store> {
    clear?: boolean;
    context?: C;
    defaultContext?: Partial<StoreType<C>>;
    contextHandlers?: Partial<HandlerMap<StoreType<C>, StoreHandlers<C>>>;
    parent?: Node;
    owner?: HNode<any>;
    sync?: boolean;
}

export const renderToDOM = function render<C extends Store = Store>(
    src: any, options: RenderOptions<C> = {}
) {

    const { parent = _document.body,
        clear, owner, context = createStore<StoreType<C>, StoreHandlers<C>>() as C,
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
