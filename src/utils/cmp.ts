import { _is, _isArray, _Node, _keys } from "./refCache";
import { HNode } from "../core/HNode";

export const cmp = function (a: unknown, b: unknown): boolean {

    if (_is(a, b)) {
        return true;
    }

    if (_isArray(a)) {
        return _isArray(b) &&
            a.length === b.length &&
            a.every((v, i) => cmp(b[i], v));
    }

    if (a && b && typeof a === 'object' && typeof b === 'object') {

        if ((a as HNode<any>).isHNode) {

            return (b as HNode<any>).isHNode &&
                (a as HNode<any>).type === (b as HNode<any>).type &&
                cmp((a as HNode<any>).props, (b as HNode<any>).props);

        } else if (!(a instanceof _Node || b instanceof _Node)) {

            const keysA = _keys(a!),
                keysB = _keys(b!);

            return keysA.length === keysB.length &&
                keysA.every(k => keysB.includes(k) && cmp((a as any)[k], (b as any)[k]));

        }

    }

    return false;

};
