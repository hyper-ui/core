import { HNode } from "./HNode";
import { Store } from "./Store";
import { supply } from "../utils/helpers";

export const initComponent = function (hNode: HNode<any>, store: Store) {

    const { props, context: ctxStore } = hNode,
        desc = hNode.desc!,
        { defaultProps, defaultStore, storeHandlers, state, context, init } = desc;

    if (defaultProps) {
        supply(props, defaultProps);
    }

    hNode.store = store;
    if (defaultStore) {
        store.setSome(defaultStore);
    }
    if (state) {
        hNode.store.bind(hNode, state);
    }
    if (storeHandlers) {
        store.handleSome(storeHandlers);
    }

    if (context) {
        ctxStore!.bind(hNode, context);
    }

    if (init) {
        init.call(hNode, props, store, ctxStore!);
    }

};