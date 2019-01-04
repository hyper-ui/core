import { listenerPrefix } from "./listen";
import { HUI } from "./HUI";
import { HNode } from "./HNode";
import { handleProp } from "./handleProp";

export function patch(
    node: HTMLElement, hNode: HNode<any>, curProps: any, oldProps: any, curPropKeys: string[]
) {

    const { events } = hNode;
    let curProp, oldProp, record;

    curPropKeys.forEach(key => {

        curProp = curProps[key];
        oldProp = oldProps[key];

        if (!HUI.cmp(curProp, oldProp)) {

            if (key.startsWith(listenerPrefix) && (record = events!.get(key))) {
                node.removeEventListener(record[0], record[1], record[2]);
            }

            handleProp(node, hNode, key, curProp, oldProp);

            oldProps[key] = curProp;

        }

    });

}