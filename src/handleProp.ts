import { propHandlers } from "./propHandlers";
import { listen, listenerPrefix } from "./listen";
import { HNode } from "./HNode";

export const handleProp = function h(node: Node, key: string, value: unknown, hNode: HNode<any>) {

    const handler = propHandlers.get(key),
        { events } = hNode;

    if (handler) {

        handler(node, value, hNode);

    } else {

        if (key.startsWith(listenerPrefix)) {

            events!.set(key, listen(node, key.slice(2), value as EventListener));

        } else if (key in node) {

            try {
                // @ts-ignore
                node[key] = value;
            } catch {
                (node as Element).setAttribute(key, value as string);
            }

        } else {

            (node as Element).setAttribute(key, value as string);

        }

    }

};
