const CAPTURE = 'Captrue',
    NONPASSIVE = 'Nonpassive',
    ONCE = 'Once';

export const listen = function (node: Node, event: string, listener: EventListener) {

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

    node.addEventListener(event, listener, (capture || !passive || once) && { capture, passive, once });

};
