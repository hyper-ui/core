import { HNode } from "./HNode";
import { _undefined, _splice } from "./refCache";
import { HUI } from "./HUI";
import { patch } from "./patch";

export type DeferCallback<A extends any[]=any[]> = (...args: A) => void;

const expired = new Array<HNode<any> | undefined>(),
    deferCallbacks = new Array<DeferCallback>();

export const preDeferCallbacks = new Array<DeferCallback<[]>>();

let willTick = false;

const ticker = function () {

    willTick = false;

    const deadline = Date.now() + HUI.frameLimit;

    let i = 0,
        cur: HNode<any> | undefined;

    for (; i < expired.length; i++) {

        cur = expired[i];

        if (!cur) {
            continue;
        }

        expired[i] = _undefined;

        try {
            patch(cur);
        } catch (err) {
            expired.splice(0, i + 1);
            throw err;
        }

        if (Date.now() >= deadline) {
            expired.splice(0, i + 1);
            return tick();
        }

    }

    expired.length = 0;

    for (i = 0; i < preDeferCallbacks.length; i++) {

        preDeferCallbacks[i]();

        if (Date.now() >= deadline) {
            preDeferCallbacks.splice(0, i + 1);
            return tick();
        }

    }

    preDeferCallbacks.length = 0;

    for (i = 0; i < deferCallbacks.length; i++) {

        deferCallbacks[i]();

        if (Date.now() >= deadline) {
            deferCallbacks.splice(0, i + 1);
            return tick();
        }

    }

    deferCallbacks.length = 0;

};

export const tick = function () {
    HUI.tick(ticker);
    willTick = true;
};

export const update = function (hNode: HNode) {

    if (!expired.includes(hNode)) {
        expired.push(hNode);
    }

    if (!willTick) {
        tick();
    }

};

export const defer = function <A extends any[]=any[]>(callback: DeferCallback<A>, ...args: A) {

    deferCallbacks.push(function () {
        callback(...args);
    });

    if (!willTick) {
        tick();
    }

};
