import { renderToDOM } from "../core/render";
import { define } from "../core/registry";
import { _document, _null } from "../utils/refCache";
import { clear } from "../utils/clear";
import { HNode } from "../core/HNode";
import { FragmentProps, Fragment } from "./Fragment";
import { HUI } from "../core/HUI";
import { Store, EmptyStore } from "../core/Store";

export interface PortalProps {
    parent?: Node;
    children?: unknown;
}

export type PortalStore = Store<{
    p: Node;
    f: HNode<FragmentProps, EmptyStore, EmptyStore>;
}, {
    c: (frag: HNode<FragmentProps, EmptyStore, EmptyStore>) => void
}>

export const Portal = define<PortalProps, PortalStore, EmptyStore>('HUI.Portal', {

    storeHandlers: {
        c: function ptl_c(fragment) {
            const { ownNode, nodes } = fragment;
            if (nodes) {
                clear(fragment);
                nodes.forEach(node => {
                    ownNode!.removeChild(node);
                });
                nodes.length = 0;
            }
        }
    },

    init: function ptl_init(props, store) {
        const { parent = _document.body } = props,
            fragment = HUI(Fragment, _null, props.children);
        store.set('p', parent);
        store.set('f', fragment);
    },

    render: function ptl_render(props, store, context) {
        const fragment = store.get('f')!;
        store.trigger('c', fragment);
        renderToDOM(fragment, {
            parent: store.get('p'),
            owner: this,
            context
        });
    },

    clear: function ptl_clr(props, store) {
        store.trigger('c', store.get('f')!);
    }

});

