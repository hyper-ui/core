import HUI from "./typings/index";
import { HNode, HDesc, ElementProps } from "./typings/core/HNode";
import { Store } from "./typings/core/Store";
import { RefCallback } from "./typings/core/propHandlers";

export as namespace HUI;

declare global {

    namespace JSX {

        interface IntrinsicElements<T extends HTMLElement = HTMLElement> {
            [name: string]: ElementProps<T>;
        }

        interface ElementChildrenAttribute {
            children: unknown;
        }

    }

}

export = HUI;
