import { render } from "./render";
import { define } from "./registry";
import { _document, _Symbol, _null } from "./refCache";
import { clear } from "./utils";
import { HNode } from "./HNode";
import { FragmentProps } from "./Fragment";
import { HUI } from "./HUI";

export interface PortalProps {
    parent?: Node;
    children?: unknown[];
}

export interface PortalStore {
    parent: Node;
    fragment: HNode<FragmentProps, {}, {}>;
}

export const portalSymbol = define<PortalProps, PortalStore, {}>('HUI.Portal', {

    init: function (props, store) {
        store.set('parent', props.parent || _document.body);
        store.set('fragment', HUI(HUI.Fragment, _null, props.children));
    },

    render: function (props, store, context) {
        render(store.get('fragment'), {
            parent: store.get('parent'),
            owner: this,
            context
        });
    },

    clear: function (props, store) {

        const fragment = store.get('fragment'),
            { ownerNode } = fragment;

        clear(fragment);

        fragment.nodes!.forEach(node => {
            ownerNode!.removeChild(node);
        });

    }

});

