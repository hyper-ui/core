import { HNode, HProps } from "./HNode";
import { registry, define, HType } from "./registry";
import { _assign, _Infinity, _requestAnimationFrame } from "../utils/refCache";
import { createStore } from "./Store";
import { renderToDOM } from "./render";
import { propHandlers, EleProps } from "./propHandlers";
import { Portal } from "../ext/Portal";
import { defer } from "../ticker/ticker";
import { compare } from "../utils/cmp";
import { Fragment } from "../ext/Fragment";
import { noCmpProps } from "../ticker/patch";

export const HUI = <P extends object = EleProps, S extends object = any, C extends object = any>(
    type: HType<P, S, C> | string, props?: P | null, ...children: unknown[]
): HNode<P, S, C> => ({
    isHN: true,
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

HUI.render = renderToDOM;

HUI.tick = function tick(callback: () => void) { _requestAnimationFrame(callback); };
HUI.frameLimit = 15;
HUI.defer = defer;

HUI.Portal = Portal;
HUI.Fragment = Fragment;

HUI.cmp = compare;
