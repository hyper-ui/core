import { HNode, toNode, HDesc, isHNode, clear } from "./HNode";
import { _isArray, _document, _undefined, _splice } from "./refCache";
import { HUI } from "./HUI";
import { Store } from "./Store";
import { toArr, toFrag } from "./utils";

export type DeferCallback<A extends any[]=any[]> = (...args: A) => void;

const expired = new Array<HNode | undefined>(),
    deferCallbacks = new Array<DeferCallback>();

export const preDeferCallbacks = new Array<DeferCallback<[]>>();

let willTick = false;

const ticker = function () {

    willTick = false;

    const deadline = Date.now() + HUI.frameLimit;

    let i = 0,
        cur: HNode | undefined,
        desc: HDesc,
        output: any,
        nodes: Node[],
        parentNode: Node,
        parent: HNode | undefined,
        parentNodes: Node | Node[],
        newNodes: Node | Node[],
        newNodesIsArray: boolean,
        index: number,
        nodesLength: number,
        context: Store;

    for (; i < expired.length; i++) {

        cur = expired[i];

        if (!cur) {
            continue;
        }

        desc = cur.desc!;
        output = cur.output;
        nodes = cur.nodes!;
        parentNode = cur.parentNode!;
        parent = cur.parent;
        context = cur.context!;

        expired[i] = _undefined;

        try {
            cur.active = false;
            newNodes = toNode(
                cur.output = toArr(desc.render(cur.props, cur.store!, context)),
                context,
                parentNode,
                cur
            );
        } catch (err) {
            if (desc.catch) {
                newNodes = toNode(
                    cur.output = toArr(desc.catch(err, cur.props, cur.store!, context)),
                    context,
                    parentNode,
                    cur
                );
            } else {
                expired.splice(0, i + 1);
                throw err;
            }
        } finally {
            cur.active = true;
        }

        newNodesIsArray = _isArray(newNodes);

        (nodes as Node[]).forEach((node, i) => {
            if (i > 0) {
                parentNode.removeChild(node);
            } else {
                parentNode.replaceChild(
                    newNodesIsArray ? toFrag(newNodes as Node[]) : newNodes as Node,
                    node
                );
            }
        });

        (output as any[]).forEach(child => {
            if (isHNode(child)) {
                clear(child);
            }
        });

        if (parent) {

            parentNodes = parent.nodes!;
            nodesLength = nodes.length;

            index = parentNodes.indexOf(nodes[0]);

            if (newNodesIsArray) {
                _splice.apply(
                    parentNodes,
                    ([index, nodesLength] as any[]).concat(newNodes) as [number, number, ...any[]]
                );
            } else {
                parentNodes.splice(index, nodesLength, newNodes as Node);
            }

        }

        cur.nodes = toArr(newNodes);

        if (Date.now() >= deadline) {
            expired.splice(0, i);
            return tick();
        }

    }

    expired.length = 0;

    for (i = 0; i < preDeferCallbacks.length; i++) {

        preDeferCallbacks[i]();

        if (Date.now() >= deadline) {
            preDeferCallbacks.splice(0, i);
            return tick();
        }

    }

    preDeferCallbacks.length = 0;

    for (i = 0; i < deferCallbacks.length; i++) {

        deferCallbacks[i]();

        if (Date.now() >= deadline) {
            deferCallbacks.splice(0, i);
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
