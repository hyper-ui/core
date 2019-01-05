import { HNode } from "./HNode";
import { mark } from "./ticker";

export const handleError = function (err: unknown, hNode: HNode<any>) {

    let { owner } = hNode,
        desc;

    if (owner) {

        while (!((desc = owner.desc) && desc.catch) && owner.owner) {
            owner = owner.owner;
        }

        owner.error = err;

        mark(owner);

    } else {

        throw err;

    }

};
