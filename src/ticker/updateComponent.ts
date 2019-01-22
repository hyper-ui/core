import { HNode, toNodeArr } from "../core/HNode";
import { toArr, toFrag, isHNode, replaceNodes, inherit, SpliceArgs } from "../utils/helpers";
import { _splice, _Infinity, _keys, _push, _indexOf, _null, _undefined } from "../utils/refCache";
import { HUI } from "../core/HUI";
import { patch } from "./patch";
import { handleError } from "../core/handleError";
import { clear } from "../utils/clear";
import { mark } from "./ticker";

export const updateComponent = function updCom(hNode: HNode<any>) {

    const { desc, out: output, nodes, owner, ownNode: ownerNode, ctx: context, props, sto: store, err: error } = hNode,
        outputLength = output!.length,
        ownerNodes = owner && owner.nodes!;

    let newNodes = ([] as Node[]).concat(nodes!);

    try {

        hNode.active = false;

        if (error) {
            hNode.err = _undefined;
            throw error;
        }

        const ownerNodeNodes = ownerNode!.childNodes;
        let old: unknown, oldProps: any, oldNodes: Node[], oldNodesLength: number,
            curNodes: Node[], curProps: any, curPropKeys: string[],
            nodeOffset = 0, nextNode: Node | null;

        (hNode.out = toArr(
            desc!.render.call(hNode, props, store!, context!)
        ).flat(_Infinity)).forEach((cur: unknown, i) => {

            if (i < outputLength) {

                old = output![i];
                oldNodesLength = 1;

                if (isHNode(old)) {

                    oldNodesLength = (oldNodes = old.nodes!).length;

                    if (isHNode(cur) && old.type === cur.type) {

                        if (old.desc) {

                            inherit(cur, old);

                            mark(cur);

                            nodeOffset += cur.nodes!.length;

                            return;

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

                    clear(old);

                } else if (!isHNode(cur) && HUI.cmp(old, cur)) {
                    return;
                }

                curNodes = toNodeArr(cur, context!, ownerNode!, hNode);

                oldNodes = _splice.apply(
                    newNodes,
                    ([newNodes.indexOf(nodes![nodeOffset]), oldNodesLength] as any[])
                        .concat(curNodes) as SpliceArgs<Node>
                );

                nodeOffset += oldNodesLength;

                replaceNodes(ownerNode!, oldNodes, curNodes);

            } else {

                if (i === outputLength) {
                    nextNode =
                        ownerNodeNodes[_indexOf.call(ownerNodeNodes, newNodes![newNodes!.length - 1]) + 1] ||
                        _null;
                }

                _push.apply(newNodes, curNodes = toNodeArr(cur, context!, ownerNode!, hNode));

                ownerNode!.insertBefore(toFrag(curNodes), nextNode);

            }

        });

    } catch (err) {

        if (desc!.catch) {

            newNodes = toNodeArr(
                hNode.out = toArr(desc!.catch!.call(hNode, err, props, store!, context!)),
                context!,
                ownerNode!,
                hNode
            );

            replaceNodes(ownerNode!, nodes!, newNodes);

            output!.forEach(child => {
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