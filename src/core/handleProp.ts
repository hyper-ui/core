import { propHandlers } from "./propHandlers";
import { listen, LISTENER_PREFIX } from "./listen";
import { HNode } from "./HNode";

export const handleProp = function (
    element: Element, hNode: HNode<any>, key: string, newValue: unknown, oldValue?: unknown
) {

    const handler = propHandlers.get(key);

    if (handler) {

        handler(element, newValue, oldValue, hNode);

    } else {

        if (key.startsWith(LISTENER_PREFIX)) {

            const { events } = hNode,
                record = events!.get(key);

            if (record) {
                element.removeEventListener(record[0], record[1], record[2]);
            }

            events!.set(key, listen(element, key.slice(2), newValue as EventListener));

        } else if (key in element) {

            try {
                (element as any)[key] = newValue;
            } catch {
                element.setAttribute(key, newValue as string);
            }

        } else {

            element.setAttribute(key, newValue as string);

        }

    }

};
