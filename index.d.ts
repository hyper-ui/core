import _HUI from "./typings/index";

export default _HUI;

declare global {
    const HUI: typeof _HUI;
}

/* types */

export { HNode, HProps, HDesc } from "./typings/HNode";
export { Store } from "./typings/Store";
export { PropHandler, RefCallback, AttributeMap, NodeProps } from "./typings/propHandlers";
export { DeferCallback } from "./typings/ticker";
export { PortalProps, PortalStore } from "./typings/Portal";
