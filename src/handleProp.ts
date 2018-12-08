import { Store } from "./Store";
import { propHandlers } from "./propHandlers";
import { listen } from "./listen";

export const handleProp = function (node: Node, key: string, value: unknown, context: Store) {

    const handler = propHandlers.get(key);

    if (handler) {

        handler(node, value, context);

    } else {

        if (key.startsWith('on')) {

            listen(node, key.slice(2), value as EventListener);

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
