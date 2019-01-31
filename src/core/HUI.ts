import { HProps as _HProps, HDesc as _HDesc, HNode as _HNode, HCallback as _HCallback, EffectCallback as _EffectCallback } from "./HNode";
import { registry, define, HType as _HType } from "./registry";
import { _assign, _Infinity, _requestAnimationFrame } from "../utils/refCache";
import { Store as _Store, createStore, HandlerMap as _HandlerMap, Setter as _Setter, SetterRecord as _SetterRecord, StoreType as _StoreType, StoreHandlers as _StoreHandlers, EmptyStore as _EmptyStore } from "./Store";
import { RenderOptions as _RenderOptions, renderToDOM } from "./render";
import { propHandlers, EleProps as _EleProps, PropHandler as _PropHandler, RefCallback as _RefCallback, AttributeMap as _AttributeMap } from "./propHandlers";
import { EventRecord as _EventRecord, EventMap as _EventMap } from "./events";
import { Portal, PortalProps as _PortalProps, PortalStore as _PortalStore } from "../ext/Portal";
import { Fragment, FragmentProps as _FragmentProps } from "../ext/Fragment";
import { defer } from "../ticker/ticker";
import { compare } from "../utils/cmp";
import { noCmpProps } from "../ticker/patch";

export const HUI = <P extends object = _EleProps, S extends _Store = _Store, C extends _Store = _Store>(
    type: _HType<P, S, C> | string, props?: P | null, ...children: unknown[]
): _HNode<P, S, C> => ({
    isHN: true,
    type,
    desc: registry.get(type as _HType),
    props: _assign({ children: children.flat(_Infinity) }, props) as unknown as _HProps<P>,
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

export namespace HUI {

    export type HProps<P extends object = any> = _HProps<P>;
    export type HCallback<P extends object = any, S extends _Store = _Store, C extends _Store = _Store, T = unknown> = _HCallback<P, S, C, T>;
    export type EffectCallback<P extends object = any, S extends _Store = _Store, C extends _Store = _Store> = _EffectCallback<P, S, C>;
    export type HDesc<P extends object = any, S extends _Store = _Store, C extends _Store = _Store> = _HDesc<P, S, C>;
    export type HNode<P extends object = any, S extends _Store = _Store, C extends _Store = _Store> = _HNode<P, S, C>;

    export type HType<P extends object = any, S extends _Store = _Store, C extends _Store = _Store> = _HType<P, S, C>;

    export type Store<T extends object = any, H extends object = any> = _Store<T, H>;
    export type StoreHandlers<S extends _Store = _Store> = _StoreHandlers<S>;
    export type HandlerMap<T extends object = any, H extends object = any> = _HandlerMap<T, H>;
    export type Setter<T = unknown> = _Setter<T>;
    export type SetterRecord<T = unknown> = _SetterRecord<T>;
    export type EmptyStore = _EmptyStore;

    export type RenderOptions<C extends Store = Store> = _RenderOptions<C>;

    export type EleProps<T extends Element = Element> = _EleProps<T>;
    export type PropHandler<T = unknown> = _PropHandler<T>;
    export type RefCallback<T extends Element = Element> = _RefCallback<T>;
    export type AttributeMap = _AttributeMap;

    export type EventRecord = _EventRecord;
    export type EventMap = _EventMap;

    export type FragmentProps = _FragmentProps;

    export type PortalProps = _PortalProps;
    export type PortalStore = _PortalStore;

}
