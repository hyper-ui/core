import { propHandlers } from "./propHandlers";
import { listen, listenerPrefix } from "./listen";
import { HNode } from "./HNode";

export const handleProp = function (element: HTMLElement, key: string, value: unknown, hNode: HNode<any>) {

    const handler = propHandlers.get(key),
        { events } = hNode;

    if (handler) {

        handler(element, value, hNode);

    } else {

        if (key.startsWith(listenerPrefix)) {

            events!.set(key, listen(element, key.slice(2), value as EventListener));

        } else if (key in element) {

            try {
                // @ts-ignore
                element[key] = value;
            } catch {
                element.setAttribute(key, value as string);
            }

        } else {

            element.setAttribute(key, value as string);

        }

    }

};
