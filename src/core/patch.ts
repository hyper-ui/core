import { HUI } from "./HUI";
import { HNode } from "./HNode";
import { handleProp } from "./handleProp";
import { noCmpProps } from "./propHandlers";

export function patch(
    node: HTMLElement, hNode: HNode<any>, curProps: any, oldProps: any, curPropKeys: string[]
) {

    let curProp, oldProp;

    curPropKeys.forEach(key => {

        curProp = curProps[key];
        oldProp = oldProps[key];

        if (noCmpProps.includes(key) || !HUI.cmp(curProp, oldProp)) {
            handleProp(node, hNode, key, curProp, oldProp);
        }

    });

}