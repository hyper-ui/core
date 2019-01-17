import { HNode } from "./HNode";
import { Store } from "./Store";

export const initComponent = function (hNode: HNode<any>, store: Store, ctxStore: Store) {

    const { props } = hNode,
        desc = hNode.desc!,
        { defaultStore, state, context, init } = desc;

    hNode.store = store;
    if (defaultStore) {
        store.setSome(defaultStore);
    }
    if (state) {
        hNode.store.bind(hNode, state);
    }

    hNode.context = ctxStore;
    if (context) {
        ctxStore.bind(hNode, context);
    }

    if (init) {
        init.call(hNode, props, store, ctxStore);
    }

};