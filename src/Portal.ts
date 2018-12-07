import { render } from "./render";
import { registry } from "./registry";
import { HDesc, isHNode, clear } from "./HNode";
import { _document, _Symbol, _isArray } from "./refCache";
import { preDeferCallbacks } from "./ticker";

export interface PortalProps {
    parent?: Node;
}

export interface PortalStore {
    parent: Node;
}

export const portalSymbol = _Symbol('HUI.Portal');

registry.set(portalSymbol, {

    init(props, store) {
        store.set('parent', props.parent || _document.body);
    },

    render(props, store, context) {
        preDeferCallbacks.push(() => {
            render(props.children, store.get('parent'), false, context);
        });
    },

    clear(props, store) {

        const parent = store.get('parent');

        props.children.flat().forEach(child => {

            if (isHNode(child)) {

                clear(child);

                const { nodes } = child;

                nodes!.forEach(node => {
                    parent.removeChild(node);
                });

            }

        });

    }

} as HDesc<PortalProps, PortalStore>);
