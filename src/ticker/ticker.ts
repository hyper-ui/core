import { HNode } from "../core/HNode";
import { _undefined, _splice, _now } from "../utils/refCache";
import { HUI } from "../core/HUI";
import { updateComponent } from "./updateComponent";
import { renderCallbacks } from "../core/render";

export type DeferCallback<A extends any[]=any[]> = (...args: A) => void;

export const expired = new Array<HNode<any> | undefined>();

const deferCallbacks = new Array<DeferCallback>(),
    preDeferCallbacks = new Array<DeferCallback<[]>>();

let willTick = false;

const ticker = function () {

    willTick = false;

    const deadline = _now() + HUI.frameLimit;

    let cur: HNode<any> | undefined,
        i: number;

    for (i = 0; i < expired.length; i++) {

        cur = expired[i];

        if (!cur) {
            continue;
        }

        expired[i] = _undefined;

        try {
            updateComponent(cur);
        } catch (err) {
            expired.splice(0, i + 1);
            throw err;
        }

        if (_now() >= deadline) {
            expired.splice(0, i + 1);
            return tick();
        }

    }

    expired.length = 0;

    for (i = 0; i < preDeferCallbacks.length; i++) {

        preDeferCallbacks[i]();

        if (_now() >= deadline) {
            preDeferCallbacks.splice(0, i + 1);
            return tick();
        }

    }

    preDeferCallbacks.length = 0;

    for (i = 0; i < renderCallbacks.length; i++) {

        renderCallbacks[i]();

        if (_now() >= deadline) {
            renderCallbacks.splice(0, i + 1);
            return tick();
        }

    }

    renderCallbacks.length = 0;

    for (i = 0; i < deferCallbacks.length; i++) {

        deferCallbacks[i]();

        if (_now() >= deadline) {
            deferCallbacks.splice(0, i + 1);
            return tick();
        }

    }

    deferCallbacks.length = 0;

};

const tick = function () {
    HUI.tick(ticker);
    willTick = true;
};

export const reqTick = function () {
    if (!willTick) {
        tick();
    }
};

export const mark = function (hNode: HNode<any>) {
    if (!expired.includes(hNode)) {
        reqTick();
        expired.push(hNode);
    }
};

export const defer = function <A extends any[]=any[]>(callback: DeferCallback<A>, ...args: A) {

    deferCallbacks.push(function () {
        callback(...args);
    });

    reqTick();

};
