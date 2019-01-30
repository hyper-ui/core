import { renderToDOM } from "../core/render";
import { define } from "../core/registry";
import { _document, _null } from "../utils/refCache";
import { clear } from "../utils/clear";
import { HNode } from "../core/HNode";
import { FragmentProps, Fragment } from "./Fragment";
import { HUI } from "../core/HUI";
import { Store } from "../core/Store";

export interface PortalProps {
    parent?: Node;
    children?: unknown;
}

export interface PortalStore {
    p: Node;
    f: HNode<FragmentProps, Store<{}>, Store<{}>>;
}

export const Portal = define<PortalProps, Store<PortalStore>, Store<{}>>('HUI.Portal', {

    init: function port_init(props, store) {
        store.set('p', props.parent || _document.body);
        store.set('f', HUI(Fragment, _null, props.children));
    },

    render: function port_render(props, store, context) {
        renderToDOM(store.get('f'), {
            parent: store.get('p'),
            owner: this,
            context
        });
    },

    clear: function port_clear(props, store) {

        const fragment = store.get('f')!,
            { ownNode, nodes } = fragment;

        clear(fragment);

        nodes!.forEach(node => {
            ownNode!.removeChild(node);
        });

        nodes!.length = 0;

    }

});

