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

export interface PortalStore {
    p: Node;
    f: HNode<FragmentProps, EmptyStore, EmptyStore>;
}

export const Portal = define<PortalProps, Store<PortalStore>, EmptyStore>('HUI.Portal', {

    effects: [
        function ptl_eff(props, store) {

            const { parent = _document.body } = props,
                fragment = HUI(Fragment, _null, props.children);

            store.set('p', parent);
            store.set('f', fragment);

            return function ptl_clr() {

                const { ownNode, nodes } = fragment;

                clear(fragment);

                nodes!.forEach(node => {
                    ownNode!.removeChild(node);
                });

                nodes!.length = 0;

            };

        }
    ],


    render: function ptl_render(props, store, context) {
        renderToDOM(store.get('f'), {
            parent: store.get('p'),
            owner: this,
            context
        });
    }

});

