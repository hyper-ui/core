import { _document, _Symbol } from "./refCache";
import { registry } from "./registry";
import { HDesc } from "./HNode";

export interface ContextProps {
    key: any;
    value: any;
}

export const contextSymbol = _Symbol('HUI.Context');

registry.set(contextSymbol, {

    init(props, store, context) {
        context.set(props.key, props.value);
    },

    render(props) {
        return props.children;
    }

} as HDesc<ContextProps, {}>);
