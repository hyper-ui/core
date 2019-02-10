import { HNode, toNodeArr } from "../core/HNode";
import { renderToDOM } from "../core/render";
import { isHNode, replaceNodes, inherit, toFrag } from "../utils/helpers";
import { patch } from "./patch";
import { _keys } from "../utils/refCache";
import { clear } from "../utils/clear";
import { HUI } from "../core/HUI";
import { mark } from "./ticker";
import { EleProps } from "../core/propHandlers";

export const updateChildren = function updChd(
    element: Element, hNode: HNode<EleProps>, newChildren: unknown[], oldChildren: unknown[]
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

                    newNodes = oldNodes;

                    if (oldChild.desc) {

                        inherit(newChild, oldChild);

                        nodeOffset += newNodes.length;

                        return mark(newChild);

                    } else {

                        newPropKeys = _keys(newProps = newChild.props);

                        if (_keys(oldProps = oldChild.props).every(key => newPropKeys.includes(key))) {

                            inherit(newChild, oldChild);

                            nodeOffset++;

                            return patch(
                                newNodes[0] as Element,
                                newChild,
                                newProps,
                                oldProps,
                                newPropKeys
                            );

                        }

                    }

                }

                clear(oldChild);

            } else if (HUI.cmp(oldChild, newChild)) {
                return nodeOffset++;
            } else {
                oldNodes = childNodes.length ? [childNodes[nodeOffset]] : [];
            }

            nodeOffset += (newNodes = toNodeArr(newChild, hNode.ctx!, element, hNode)).length;

            if (oldNodes.length) {
                replaceNodes(element, oldNodes, newNodes);
            } else {
                element.appendChild(toFrag(newNodes));
            }

        } else {

            if (isHNode(oldChild)) {
                clear(oldChild);
                oldNodes = oldChild.nodes!;
                oldChild.nodes!.forEach(node => {
                    element.removeChild(node);
                });
                oldChild.nodes!.length = 0;
            } else if (childNodes.length > nodeOffset) {
                element.removeChild(childNodes[nodeOffset++]);
            }

        }

    });

    if (oldChildrenCount < newChildren.length) {
        renderToDOM(newChildren.slice(oldChildrenCount), {
            parent: element,
            owner: hNode,
            context: hNode.ctx
        });
    }

};
