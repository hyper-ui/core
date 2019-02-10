import { expired } from "../ticker/ticker";
import { HNode } from "../core/HNode";
import { _console } from "./refCache";
import { isHNode } from "./helpers";

export const clear = function clr(hNode: HNode<any>) {

    const { desc, props } = hNode;

    hNode.active = false;

    if (desc) {

        const { sto, ctx } = hNode;

        try {

            if (hNode.eff) {
                hNode.eff.forEach(effCanceller => {
                    effCanceller();
                });
            }

            if (desc.clear) {
                desc.clear.call(hNode, props, sto!, ctx!);
            }

        } catch (err) {
            _console.error(err);
        }

    } else {

        if (props.ref) {
            props.ref();
        }

    }

    const index = expired.indexOf(hNode);
    if (~index) {
        expired.splice(index, 1);
    }

    if (hNode.out) {
        hNode.out.forEach((child: unknown) => {
            if (isHNode(child)) {
                clear(child);
            }
        });
    }

};
