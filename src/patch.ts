import { HNode, toNode, EventRecord, EventMap } from "./HNode";
import { toArr, toFrag, isHNode, clear } from "./utils";
import { _splice, _Infinity, _keys, _push, _indexOf } from "./refCache";
import { HUI } from "./HUI";
import { listenerPrefix } from "./listen";
import { handleProp } from "./handleProp";
import { Store } from "./Store";

export const patch = function (hNode: HNode<any>) {

    const { desc, output, nodes, owner, ownerNode, context, props, store } = hNode,
        outputLength = output!.length,
        ownerNodes = owner && owner.nodes!,
        nodesLength = nodes!.length;

    let newNodes = ([] as Node[]).concat(nodes!);

    try {

        hNode.active = false;

        const ownerNodeNodes = ownerNode!.childNodes;
        let old: unknown, oldProps: any, oldNodes: Node[], oldNodesLength: number,
            curNode: Node, curNodes: Node[], curProps: any, curProp: unknown, curPropKeys: string[],
            curContext: Store, events: EventMap, record: EventRecord | undefined,
            nodeOffset = 0,
            nextNode: Node | null,
            newOutput: unknown[];

        (newOutput = hNode.output = toArr(
            desc!.render(props, store!, context!)
        ).flat(_Infinity)).forEach((cur: unknown, i) => {

            if (i < outputLength) {

                old = output![i];

                if (isHNode(old)) {

                    nodeOffset += (oldNodesLength = (oldNodes = old.nodes!).length);

                    if (isHNode(cur) && old.type === cur.type && !old.desc) {

                        curPropKeys = _keys(curProps = cur.props);

                        if (_keys(oldProps = old.props).every(k => curPropKeys.includes(k))) {

                            newOutput[i] = old;
                            curContext = old.context!;
                            events = old.events!;
                            curNode = oldNodes[0];

                            return curPropKeys.forEach(key => {

                                curProp = curProps[key];

                                if (!HUI.cmp(curProp, oldProps[key])) {

                                    if (key.startsWith(listenerPrefix) && (record = events!.get(key))) {
                                        curNode.removeEventListener(record[0], record[1], record[2]);
                                    }

                                    oldProps[key] = curProp;

                                    handleProp(curNode, key, curProp, curContext, events!);

                                }

                            });

                        }

                    }

                    clear(old);

                } else if (!isHNode(cur) && HUI.cmp(old, cur)) {
                    return;
                } else {
                    nodeOffset++;
                }

                oldNodesLength = 1;
                curNodes = toArr(toNode(cur, context!, ownerNode!, hNode));

                oldNodes = _splice.apply(
                    newNodes,
                    ([newNodes.indexOf(nodes![nodeOffset]), oldNodesLength] as any[])
                        .concat(curNodes) as [number, number, ...any[]]
                );

                oldNodes.forEach((oldNode, i) => {
                    if (i) {
                        ownerNode!.removeChild(oldNode);
                    } else {
                        ownerNode!.replaceChild(toFrag(curNodes), oldNode);
                    }
                });

            } else {

                if (i === outputLength) {
                    nextNode = ownerNodeNodes[
                        _indexOf.call(ownerNodeNodes, newNodes![newNodes!.length - 1]) + 1
                    ] || null;
                }

                _push.apply(newNodes, curNodes = toArr(toNode(cur, context!, ownerNode!, hNode)));

                ownerNode!.insertBefore(toFrag(curNodes), nextNode);

            }

        });

    } catch (err) {

        if (desc!.catch) {

            newNodes = toArr(toNode(
                hNode.output = toArr(desc!.catch!(err, props, store!, context!)),
                context!,
                ownerNode!,
                hNode
            ));

            nodes!.forEach((node, i) => {
                if (i > 0) {
                    ownerNode!.removeChild(node);
                } else {
                    ownerNode!.replaceChild(toFrag(newNodes), node);
                }
            });

            output!.forEach(child => {
                if (isHNode(child)) {
                    clear(child);
                }
            });

        } else {
            throw err;
        }

    } finally {
        hNode.active = true;
    }

    if (ownerNodes) {
        _splice.apply(
            ownerNodes,
            ([ownerNodes.indexOf(nodes![0]), nodesLength] as any[])
                .concat(newNodes) as [number, number, ...any[]]
        );
    }

    hNode.nodes = newNodes;

};