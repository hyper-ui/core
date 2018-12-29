import { EventRecord } from "./HNode";

export const listenerPrefix = 'on';

const CAPTURE = 'Captrue',
    NONPASSIVE = 'Nonpassive',
    ONCE = 'Once';

export const listen = function l(node: Node, event: string, listener: EventListener): EventRecord {

    let capture = false,
        passive = true,
        once = false;

    for (let i = 0; i < 3; i++) {
        if (!capture && event.endsWith(CAPTURE)) {
            capture = true;
            event = event.slice(0, -7);
        } else if (passive && event.endsWith(NONPASSIVE)) {
            passive = false;
            event = event.slice(0, -10);
        } else if (!once && event.endsWith(ONCE)) {
            once = true;
            event = event.slice(0, -4);
        }
    }

    const options = (capture || !passive || once) && { capture, passive, once };

    node.addEventListener(event, listener, options);

    return [event, listener, options];

};
