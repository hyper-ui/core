import { Store } from "./Store";
import { propHandlers } from "./propHandlers";
import { listen, listenerPrefix } from "./listen";
import { EventMap } from "./HNode";

export const handleProp = function (
    node: Node, key: string, value: unknown, context: Store, events: EventMap
) {

    const handler = propHandlers.get(key);

    if (handler) {

        handler(node, value, context, events);

    } else {

        if (key.startsWith(listenerPrefix)) {

            events.set(key, listen(node, key.slice(2), value as EventListener));

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
