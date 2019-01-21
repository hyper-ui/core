export type EventRecord = [string, EventListener, boolean | AddEventListenerOptions];
export type EventMap = Map<string, EventRecord>;

export const LISTENER_PREFIX = 'on';

const CAPTURE = 'Captrue',
    NONPASSIVE = 'Nonpassive',
    ONCE = 'Once';

export const listen = function (element: Element, event: string, listener: EventListener): EventRecord {

    let capture = false,
        passive = true,
        once = false;

    for (let i = 0; i < 3; i++) {
        if (event.endsWith(CAPTURE)) {
            capture = true;
            event = event.slice(0, -7);
        } else if (event.endsWith(NONPASSIVE)) {
            passive = false;
            event = event.slice(0, -10);
        } else if (event.endsWith(ONCE)) {
            once = true;
            event = event.slice(0, -4);
        }
    }

    const options = (capture || !passive || once) && { capture, passive, once };

    element.addEventListener(event, listener, options);

    return [event, listener, options];

};
