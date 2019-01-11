import { HNode, HProps, ElementProps } from "./HNode";
import { registry, define, HType } from "./registry";
import { _assign, _Infinity } from "../utils/refCache";
import { createStore } from "./Store";
import { render } from "./render";
import { propHandlers, noCmpProps } from "./propHandlers";
import { portalSymbol } from "../ext/Portal";
import { contextSymbol } from "../ext/Context";
import { defer } from "./ticker";
import { cmp } from "../utils/cmp";
import { fragmentSymbol } from "../ext/Fragment";

export const HUI = <P extends object = ElementProps, S extends object = any, C extends object = any>(
    type: HType<P, S, C> | string, props?: P | null, ...children: unknown[]
): HNode<P, S, C> => ({
    isHNode: true,
    type,
    desc: registry.get(type),
    props: _assign({ children: children.flat(_Infinity) }, props) as HProps<P>,
    active: true
});

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
