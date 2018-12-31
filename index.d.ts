import HUI from "./typings/index";
import { HNode, HDesc, ElementProps } from "./typings/HNode";
import { Store } from "./typings/Store";
import { RefCallback } from "./typings/propHandlers";

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
