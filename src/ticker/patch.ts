import { HUI } from "../core/HUI";
import { HNode } from "../core/HNode";
import { handleProp } from "../core/handleProp";

export const noCmpProps = ['children'];

export const patch = function patchEle(
    element: Element, hNode: HNode<any>, curProps: any, oldProps: any, curPropKeys: string[]
) {

    let curProp, oldProp;

    curPropKeys.forEach(key => {

        curProp = curProps[key];
        oldProp = oldProps[key];

        if (noCmpProps.includes(key) || !HUI.cmp(curProp, oldProp)) {
            handleProp(element, hNode, key, curProp, oldProp);
        }

    });

}