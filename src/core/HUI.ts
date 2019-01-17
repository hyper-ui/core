import { HNode, HProps } from "./HNode";
import { registry, define, HType } from "./registry";
import { _assign, _Infinity } from "../utils/refCache";
import { createStore } from "./Store";
import { render } from "./render";
import { propHandlers, EleProps } from "./propHandlers";
import { portalSymbol } from "../ext/Portal";
import { contextSymbol } from "../ext/Context";
import { defer } from "../ticker/ticker";
import { cmp } from "../utils/cmp";
import { fragmentSymbol } from "../ext/Fragment";
import { noCmpProps } from "../ticker/patch";

export const HUI = <P extends object = EleProps, S extends object = any, C extends object = any>(
    type: HType<P, S, C> | string, props?: P | null, ...children: unknown[]
): HNode<P, S, C> => {
    const desc = registry.get(type);
    return {
        isHNode: true,
        type,
        desc,
        props: _assign({ children: children.flat(_Infinity) }, desc && desc.defaultProps, props) as HProps<P>,
        active: true
    };
};

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
