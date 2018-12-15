import { HNode, HProps, HDesc, NodeProps } from "./HNode";
import { registry, define } from "./registry";
import { _String, _assign, _Map } from "./refCache";
import { createStore } from "./Store";
import { render } from "./render";
import { propHandlers } from "./propHandlers";
import { portalSymbol } from "./Portal";
import { contextSymbol } from "./Context";
import { defer } from "./ticker";
import { cmp } from "./utils";

export const HUI = function <P extends object = NodeProps, S extends object = any, C extends object = any>(
    type: unknown, props?: P, ...children: unknown[]
): HNode<P, S, C> {

    const desc: HDesc<P, S, C> | undefined = registry.get(type);

    const hNode: HNode<P, S, C> = {
        isHNode: true,
        type,
        desc,
        props: _assign({ children }, props) as HProps<P>,
        active: true
    };

    if (desc) {
        hNode.store = createStore<S>(hNode, desc && desc.state);
    } else {
        hNode.events = new _Map();
    }

    return hNode;

};

/* attachments */

HUI.registry = registry;
HUI.define = define;

HUI.createStore = createStore;

HUI.propHandlers = propHandlers;

HUI.render = render;

HUI.tick = function (callback: () => void) { requestAnimationFrame(callback); };
HUI.frameLimit = 15;
HUI.defer = defer;

HUI.Portal = portalSymbol;
HUI.Context = contextSymbol;

HUI.cmp = cmp;
