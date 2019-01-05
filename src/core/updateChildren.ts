import { HNode, ElementProps, toNodes } from "./HNode";
import { render } from "./render";
import { isHNode, replaceNodes, inherit as inherit } from "../utils/helpers";
import { patch } from "./patch";
import { _keys } from "../utils/refCache";
import { clear } from "../utils/clear";
import { HUI } from "./HUI";
import { mark } from "./ticker";

export const updateChildren = function (
    element: Element, hNode: HNode<ElementProps>, newChildren: unknown[], oldChildren: unknown[]
) {

    const { childNodes } = element,
        oldChildrenCount = oldChildren.length;

    let nodeOffset = 0,
        oldProps: any,
        oldNodes: Node[],
        newChild: unknown,
        newNodes: Node[],
        newProps: any,
        newPropKeys: string[];

    oldChildren.forEach((oldChild, i) => {

        newChild = newChildren[i];

        if (newChild) {

            if (isHNode(oldChild)) {

                oldNodes = oldChild.nodes!;

                if (isHNode(newChild) && newChild.type === oldChild.type) {

                    newNodes = newChild.nodes = oldNodes;

                    if (oldChild.desc) {

                        inherit(newChild, oldChild);

                        nodeOffset += newNodes.length;

                        return mark(newChild);

                    } else {

                        newPropKeys = _keys(newProps = newChild.props);

                        if (_keys(oldProps = oldChild.props).every(key => newPropKeys.includes(key))) {

                            inherit(newChild, oldChild);

                            return patch(
                                newNodes[0] as HTMLElement,
                                newChild,
                                newProps,
                                oldProps,
                                newPropKeys
                            );

                        }

                    }

                }

                nodeOffset -= oldNodes.length;

                clear(oldChild);

            } else if (HUI.cmp(oldChild, newChild)) {
                return;
            } else {
                oldNodes = childNodes.length ? [childNodes[nodeOffset]] : [];
            }

            newNodes = toNodes(newChild, hNode.context!, element, hNode);
            nodeOffset += newNodes.length;
            replaceNodes(element, oldNodes, newNodes);

        } else {

            if (isHNode(oldChild)) {
                clear(oldChild);
                oldChild.nodes!.forEach(node => {
                    element.removeChild(node);
                });
            } else {
                element.removeChild(childNodes[nodeOffset++]);
            }

        }

    });

    if (oldChildrenCount < newChildren.length) {
        render(newChildren.slice(oldChildrenCount), {
            parent: element,
            owner: hNode,
            context: hNode.context!
        });
    }

};
