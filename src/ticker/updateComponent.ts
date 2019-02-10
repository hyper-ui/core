import { HNode, toNodeArr } from "../core/HNode";
import { toArr, toFrag, isHNode, replaceNodes, inherit, SpliceArgs } from "../utils/helpers";
import { _splice, _Infinity, _keys, _push, _indexOf, _null, _undefined } from "../utils/refCache";
import { HUI } from "../core/HUI";
import { patch } from "./patch";
import { handleError } from "../core/handleError";
import { clear } from "../utils/clear";
import { mark } from "./ticker";

export const updateComponent = function updCom(hNode: HNode<any>) {

    const { desc, out, nodes, owner, ownNode, ctx, props, sto, err } = hNode,
        outLength = out!.length,
        ownerNodes = owner && owner.nodes!;

    let newNodes = ([] as Node[]).concat(nodes!);

    try {

        hNode.active = false;

        if (err) {
            hNode.err = _undefined;
            throw err;
        }

        const ownerNodeNodes = ownNode!.childNodes;
        let old: unknown, oldProps: any, oldNodes: Node[], oldNodesLength: number,
            curNodes: Node[], curProps: any, curPropKeys: string[],
            nodeOffset = 0, nextNodeIndex: number, nextNode: Node | null;

        const newOut = hNode.out = toArr(desc!.render.call(hNode, props, sto!, ctx!)).flat(_Infinity),
            newOutLength = newOut.length;

        newOut.forEach((cur: unknown, i) => {

            if (i < outLength) {

                old = out![i];
                oldNodesLength = 1;

                if (isHNode(old)) {

                    oldNodesLength = (oldNodes = old.nodes!).length;

                    clear(old);

                    if (isHNode(cur) && old.type === cur.type) {

                        if (old.desc) {

                            inherit(cur, old);

                            mark(cur);

                            return nodeOffset += oldNodesLength;

                        } else {

                            curPropKeys = _keys(curProps = cur.props);

                            if (_keys(oldProps = old.props).every(k => curPropKeys.includes(k))) {

                                nodeOffset++;

                                inherit(cur, old);

                                return patch(
                                    oldNodes[0] as Element,
                                    cur,
                                    curProps,
                                    oldProps,
                                    curPropKeys
                                );

                            }

                        }

                    }

                } else if (!isHNode(cur) && HUI.cmp(old, cur)) {
                    return nodeOffset++;
                }

                curNodes = toNodeArr(cur, ctx!, ownNode!, hNode);

                oldNodes = _splice.apply(
                    newNodes,
                    ([newNodes.indexOf(nodes![nodeOffset]), oldNodesLength] as any[])
                        .concat(curNodes) as SpliceArgs<Node>
                );

                nodeOffset += oldNodesLength;

                replaceNodes(ownNode!, oldNodes, curNodes);

            } else {

                if (i === outLength) {
                    nextNodeIndex = _indexOf.call(ownerNodeNodes, newNodes![newNodes!.length - 1]) + 1;
                    nextNode = ownerNodeNodes[nextNodeIndex] || _null;
                }

                _push.apply(newNodes, curNodes = toNodeArr(cur, ctx!, ownNode!, hNode));

                ownNode!.insertBefore(toFrag(curNodes), nextNode);

            }

        });

        if (outLength > newOutLength) {
            out!.slice(newOutLength).forEach(extra => {
                if (isHNode(extra)) {
                    clear(extra);
                }
            });
            newNodes.splice(nodeOffset).forEach(extraNode => {
                ownNode!.removeChild(extraNode);
            });
        }

    } catch (err) {

        if (desc!.catch) {

            newNodes = toNodeArr(
                hNode.out = toArr(desc!.catch!.call(hNode, err, props, sto!, ctx!)),
                ctx!,
                ownNode!,
                hNode
            );

            replaceNodes(ownNode!, nodes!, newNodes);

            out!.forEach(child => {
                if (isHNode(child)) {
                    clear(child);
                }
            });

        } else {
            handleError(err, hNode);
        }

    } finally {
        hNode.active = true;
    }

    if (ownerNodes) {

        type RestArgs = [number, ...Node[]];

        const firstNode = nodes![0],
            restArgs = ([nodes!.length] as RestArgs).concat(newNodes) as RestArgs;

        let target = owner,
            targetNodes = ownerNodes;

        while (target) {

            targetNodes = target.nodes!;

            _splice.apply(
                targetNodes,
                ([targetNodes.indexOf(firstNode)] as SpliceArgs<Node>).concat(restArgs) as SpliceArgs<Node>
            );

            target = target.owner;

        }

    }

    hNode.nodes = newNodes;

};