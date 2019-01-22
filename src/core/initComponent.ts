import { HNode } from "./HNode";
import { Store } from "./Store";
import { supply } from "../utils/helpers";

export const initComponent = function initCom(hNode: HNode<any>, store: Store) {

    const { props, ctx } = hNode,
        desc = hNode.desc!,
        { defaultProps, defaultStore, storeHandlers, state, context, init } = desc;

    if (defaultProps) {
        supply(props, defaultProps);
    }

    hNode.sto = store;
    if (defaultStore) {
        store.setSome(defaultStore);
    }
    if (state) {
        hNode.sto.bind(hNode, state);
    }
    if (storeHandlers) {
        store.handleSome(storeHandlers);
    }

    if (context) {
        ctx!.bind(hNode, context);
    }

    if (init) {
        init.call(hNode, props, store, ctx!);
    }

};