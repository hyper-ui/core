import { HNode, toNode } from "./HNode";
import { toArr, toFrag, isHNode, clear } from "./utils";
import { _splice } from "./refCache";

export const patch = function (hNode: HNode<any>) {

    const { desc, output, nodes, owner, ownerNode, context, props, store } = hNode,
        ownerNodes = owner && owner.nodes!,
        nodesLength = nodes!.length;

    let newNodes: Node[];

    try {
        hNode.active = false;
        newNodes = toArr(toNode(
            hNode.output = toArr(desc!.render(props, store!, context!)),
            context!,
            ownerNode!,
            hNode
        ));
    } catch (err) {
        if (desc!.catch) {
            newNodes = toArr(toNode(
                hNode.output = toArr(desc!.catch!(err, props, store!, context!)),
                context!,
                ownerNode!,
                hNode
            ));
        } else {
            throw err;
        }
    } finally {
        hNode.active = true;
    }

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

    if (ownerNodes) {
        _splice.apply(
            ownerNodes,
            ([ownerNodes.indexOf(nodes![0]), nodesLength] as any[])
                .concat(newNodes) as [number, number, ...any[]]
        );
    }

    hNode.nodes = newNodes;

};