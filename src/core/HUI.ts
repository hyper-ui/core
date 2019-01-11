import { HNode, HProps, HDesc, ElementProps } from "./HNode";
import { registry, define, HType } from "./registry";
import { _String, _assign, _Map, _Infinity } from "../utils/refCache";
import { createStore } from "./Store";
import { render } from "./render";
import { propHandlers, noCmpProps } from "./propHandlers";
import { portalSymbol } from "../ext/Portal";
import { contextSymbol } from "../ext/Context";
import { defer } from "./ticker";
import { cmp } from "../utils/cmp";
import { fragmentSymbol } from "../ext/Fragment";

export const HUI = function <P extends object = ElementProps, S extends object = any, C extends object = any>(
    type: HType<P, S, C> | string, props?: P | null, ...children: unknown[]
): HNode<P, S, C> {

    const desc: HDesc<P, S, C> | undefined = registry.get(type);

    const hNode: HNode<P, S, C> = {
        isHNode: true,
        type,
        desc,
        props: _assign({ children: children.flat(_Infinity) }, props) as HProps<P>,
        active: true
    };

    if (desc) {

        hNode.store = createStore<S>();
        if (desc.state) {
            hNode.store.bind(hNode, desc.state);
        }

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
HUI.noCmpProps = noCmpProps;

HUI.render = render;

HUI.tick = function (callback: () => void) { requestAnimationFrame(callback); };
HUI.frameLimit = 15;
HUI.defer = defer;

HUI.Portal = portalSymbol;
HUI.Context = contextSymbol;
HUI.Fragment = fragmentSymbol;

HUI.cmp = cmp;
