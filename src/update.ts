import { HNode, toNode } from "./HNode";
import { toArr, toFrag, isHNode, clear } from "./utils";
import { _splice, _Infinity, _keys, _push, _indexOf, _null, _undefined } from "./refCache";
import { HUI } from "./HUI";
import { patch } from "./patch";
import { handleError } from "./handleError";

export const update = function (hNode: HNode<any>) {

    const { desc, output, nodes, owner, ownerNode, context, props, store, error } = hNode,
        outputLength = output!.length,
        ownerNodes = owner && owner.nodes!;

    let newNodes = ([] as Node[]).concat(nodes!);

    try {

        hNode.active = false;

        if (error) {
            hNode.error = _undefined;
            throw error;
        }

        const ownerNodeNodes = ownerNode!.childNodes;
        let old: unknown, oldProps: any, oldNodes: Node[], oldNodesLength: number,
            curNodes: Node[], curProps: any, curPropKeys: string[],
            nodeOffset = 0,
            nextNode: Node | null,
            newOutput: unknown[];

        (newOutput = hNode.output = toArr(
            desc!.render.call(hNode, props, store!, context!)
        ).flat(_Infinity)).forEach((cur: unknown, i) => {

            if (i < outputLength) {

                old = output![i];
                oldNodesLength = 1;

                if (isHNode(old)) {

                    oldNodesLength = (oldNodes = old.nodes!).length;

                    if (isHNode(cur) && old.type === cur.type && !old.desc) {

                        curPropKeys = _keys(curProps = cur.props);

                        if (_keys(oldProps = old.props).every(k => curPropKeys.includes(k))) {

                            newOutput[i] = old;

                            nodeOffset += oldNodesLength;

                            return patch(oldNodes[0] as HTMLElement, old, curProps, oldProps, curPropKeys);

                        }

                    }

                    clear(old);

                } else if (!isHNode(cur) && HUI.cmp(old, cur)) {
                    return;
                }

                curNodes = toArr(toNode(cur, context!, ownerNode!, hNode));

                oldNodes = _splice.apply(
                    newNodes,
                    ([newNodes.indexOf(nodes![nodeOffset]), oldNodesLength] as any[])
                        .concat(curNodes) as [number, number, ...any[]]
                );

                nodeOffset += oldNodesLength;

                oldNodes.forEach((oldNode, i) => {
                    if (i) {
                        ownerNode!.removeChild(oldNode);
                    } else {
                        ownerNode!.replaceChild(toFrag(curNodes), oldNode);
                    }
                });

            } else {

                if (i === outputLength) {
                    nextNode =
                        ownerNodeNodes[_indexOf.call(ownerNodeNodes, newNodes![newNodes!.length - 1]) + 1] ||
                        _null;
                }

                _push.apply(newNodes, curNodes = toArr(toNode(cur, context!, ownerNode!, hNode)));

                ownerNode!.insertBefore(toFrag(curNodes), nextNode);

            }

        });

    } catch (err) {

        if (desc!.catch) {

            newNodes = toArr(toNode(
                hNode.output = toArr(desc!.catch!.call(hNode, err, props, store!, context!)),
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
            handleError(err, hNode);
        }

    } finally {
        hNode.active = true;
    }

    if (ownerNodes) {

        type RestArgs = [number, ...Node[]];
        type SpliceArgs = [number, number, ...Node[]];

        const firstNode = nodes![0],
            restArgs = ([nodes!.length] as RestArgs).concat(newNodes) as RestArgs;

        let target = owner,
            targetNodes = ownerNodes;

        while (target) {

            targetNodes = target.nodes!;

            _splice.apply(
                targetNodes,
                ([targetNodes.indexOf(firstNode)] as SpliceArgs).concat(restArgs) as SpliceArgs
            );

            target = target.owner;

        }

    }

    hNode.nodes = newNodes;

};