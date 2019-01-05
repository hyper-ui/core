import { render } from "../core/render";
import { define } from "../core/registry";
import { _document, _Symbol, _null } from "../utils/refCache";
import { clear } from "../utils/clear";
import { HNode } from "../core/HNode";
import { FragmentProps } from "./Fragment";
import { HUI } from "../core/HUI";

export interface PortalProps {
    parent?: Node;
    children?: unknown[];
}

export interface PortalStore {
    parent: Node;
    fragment: HNode<FragmentProps, {}, {}>;
}

export const portalSymbol = define<PortalProps, PortalStore, {}>('HUI.Portal', {

    init: function portal_init(props, store) {
        store.set('parent', props.parent || _document.body);
        store.set('fragment', HUI(HUI.Fragment, _null, props.children));
    },

    render: function portal_render(props, store, context) {
        render(store.get('fragment'), {
            parent: store.get('parent'),
            owner: this,
            context
        });
    },

    clear: function portal_clear(props, store) {

        const fragment = store.get('fragment'),
            { ownerNode, nodes } = fragment;

        clear(fragment);

        nodes!.forEach(node => {
            ownerNode!.removeChild(node);
        });

        nodes!.length = 0;

    }

});

