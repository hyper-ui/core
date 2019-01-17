import { HNode } from "./HNode";
import { Store } from "./Store";
import { _keys } from "../utils/refCache";

export const initComponent = function (hNode: HNode<any>, store: Store, context: Store) {

    const { props } = hNode,
        desc = hNode.desc!,
        { defaultStore } = desc;

    hNode.store = store;
    if (defaultStore) {
        _keys(defaultStore).forEach(key => {
            store.set(key, defaultStore[key]);
        });
    }
    if (desc.state) {
        hNode.store.bind(hNode, desc.state);
    }

    hNode.context = context;
    if (desc.context) {
        context.bind(hNode, desc.context);
    }

    if (desc.init) {
        desc.init.call(hNode, props, store, context);
    }

};