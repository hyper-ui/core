import { HNode } from "./HNode";
import { mark } from "../ticker/ticker";

export const handleError = function handleErr(err: unknown, hNode: HNode<any>) {

    let { owner } = hNode,
        desc;

    if (owner) {

        while (!((desc = owner.desc) && desc.catch) && owner.owner) {
            owner = owner.owner;
        }

        owner.err = err;

        mark(owner);

    } else {

        throw err;

    }

};
