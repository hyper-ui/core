import { HNode, HProps } from "./HNode";
import { Store } from "./Store";
import { supply } from "../utils/helpers";
import { _Boolean } from "../utils/refCache";

export const initComponent = function initCom<P extends object = any, S extends Store = Store, C extends Store = Store>(hNode: HNode<P, S, C>, store: S) {

    const { props, ctx } = hNode,
        desc = hNode.desc!,
        { defaultProps, defaultStore, storeHandlers, state, context, init, effects } = desc;

    if (defaultProps) {
        supply(props, defaultProps as Partial<HProps<P>>);
    }

    hNode.sto = store;
    if (defaultStore) {
        store.setSome(defaultStore);
    }
    if (state) {
        hNode.sto.bind(hNode as unknown as HNode, state);
    }
    if (storeHandlers) {
        store.handleSome(storeHandlers);
    }

    if (context) {
        ctx!.bind(hNode as unknown as HNode, context);
    }

    if (init) {
        init.call(hNode, props, store, ctx!);
    }

    if (effects) {
        hNode.eff = effects.map(effect => effect.call(hNode, props, store, ctx!)).filter(_Boolean) as (() => void)[];
    }

};