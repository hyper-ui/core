import { listenerPrefix } from "./listen";
import { HUI } from "./HUI";
import { EventMap } from "./HNode";
import { Store } from "./Store";
import { handleProp } from "./handleProp";

export function patch(
    node: Node, curProps: any, oldProps: any, curPropKeys: string[], context: Store, events: EventMap
) {

    let curProp, record;

    curPropKeys.forEach(key => {

        curProp = curProps[key];

        if (!HUI.cmp(curProp, oldProps[key])) {

            if (key.startsWith(listenerPrefix) && (record = events!.get(key))) {
                node.removeEventListener(record[0], record[1], record[2]);
            }

            oldProps[key] = curProp;

            handleProp(node, key, curProp, context, events!);

        }

    });

}