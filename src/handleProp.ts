import { propHandlers } from "./propHandlers";
import { listen, listenerPrefix } from "./listen";
import { HNode } from "./HNode";

export const handleProp = function (
    element: HTMLElement, hNode: HNode<any>, key: string, newValue: unknown, oldValue?: unknown
) {

    const handler = propHandlers.get(key),
        { events } = hNode;

    if (handler) {

        handler(element, newValue, oldValue, hNode);

    } else {

        if (key.startsWith(listenerPrefix)) {

            events!.set(key, listen(element, key.slice(2), newValue as EventListener));

        } else if (key in element) {

            try {
                // @ts-ignore
                element[key] = newValue;
            } catch {
                element.setAttribute(key, newValue as string);
            }

        } else {

            element.setAttribute(key, newValue as string);

        }

    }

};
