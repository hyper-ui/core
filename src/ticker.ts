import { HNode, toNode, HDesc, isHNode, clear } from "./HNode";
import { _isArray, _document, _ArrProto } from "./refCache";
import { HUI } from "./HUI";
import { Store } from "./Store";

export type DeferCallback<A extends any[]=any[]> = (...args: A) => void;

const expired = new Array<HNode>(),
    deferCallbacks = new Array<DeferCallback>();

export const preDeferCallbacks = new Array<DeferCallback<[]>>();

let willTick = false;

const ticker = function () {

    willTick = false;

    const deadline = Date.now() + HUI.frameLimit;

    let i = 0,
        cur: HNode,
        desc: HDesc,
        output: any,
        nodes: Node | Node[],
        parentNode: Node,
        parent: HNode | undefined,
        parentNodes: Node | Node[],
        newNodes: Node | Node[],
        newNode: Node,
        parentNodesIsArray: boolean,
        nodesIsArray: boolean,
        newNodesIsArray: boolean,
        index: number,
        nodesLength: number,
        context: Store;

    for (; i < expired.length; i++) {

        cur = expired[i];
        desc = cur.desc!;
        output = cur.output;
        nodes = cur.nodes!;
        parentNode = cur.parentNode!;
        parent = cur.parent;
        context = cur.context!;

        try {
            cur.active = false;
            newNodes = toNode(
                cur.output = desc.render(cur.props, cur.store!, context),
                context,
                parentNode,
                cur
            );
        } catch (err) {
            if (desc.catch) {
                newNodes = toNode(
                    cur.output = desc.catch(err, cur.props, cur.store!, context),
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

        if (newNodesIsArray) {
            newNode = _document.createDocumentFragment();
            (newNodes as Node[]).forEach(node => {
                newNode.appendChild(node);
            });
        } else {
            newNode = newNodes as Node;
        }

        nodesIsArray = _isArray(nodes);

        if (nodesIsArray) {
            (nodes as Node[]).forEach((node, i) => {
                if (i > 0) {
                    parentNode.removeChild(node);
                } else {
                    parentNode.replaceChild(newNode, node);
                }
            });
            (output as any[]).forEach(child => {
                if (isHNode(child)) {
                    clear(child);
                }
            });
        } else {
            parentNode.replaceChild(newNode, nodes as Node);
            if (isHNode(output)) {
                clear(output);
            }
        }

        if (parent) {

            parentNodes = parent.nodes!;
            parentNodesIsArray = _isArray(parentNodes);
            nodesLength = (nodes as Node[]).length;

            if (parentNodesIsArray) {
                index = (parentNodes as Node[]).indexOf(
                    nodesIsArray ? (nodes as Node[])[0] : nodes as Node
                );
                if (newNodesIsArray) {
                    _ArrProto.splice.apply(
                        parentNodes as Node[],
                        ([index, nodesLength] as any[]).concat(newNodes as Node[])
                    );
                } else {
                    (parentNodes as Node[]).splice(index, nodesLength, newNodes as Node);
                }
            } else {
                parent.nodes = newNodes;
            }

        }

        cur.nodes = newNodes;

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
