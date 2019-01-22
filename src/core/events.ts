export type EventRecord = [string, EventListener, boolean | AddEventListenerOptions];
export type EventMap = Map<string, EventRecord>;

export const listen = function (element: Element, event: string, listener: EventListener): EventRecord {

    let capture = false,
        passive = true,
        once = false;

    for (let i = 0; i < 3; i++) {
        if (event.endsWith('Capture')) {
            capture = true;
            event = event.slice(0, -7);
        } else if (event.endsWith('Nonpassive')) {
            passive = false;
            event = event.slice(0, -10);
        } else if (event.endsWith('Once')) {
            once = true;
            event = event.slice(0, -4);
        }
    }

    const options = (capture || !passive || once) && { capture, passive, once };

    element.addEventListener(event, listener, options);

    return [event, listener, options];

};
