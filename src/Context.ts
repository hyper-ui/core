import { _document, _Symbol } from "./refCache";
import { define } from "./registry";

export interface ContextProps {
    key: any;
    value: any;
    children?: unknown[];
}

export const contextSymbol = define<ContextProps, {}, any>('HUI.Context', {

    init: function (props, store, context) {
        context.set(props.key, props.value);
    },

    render: function (props) {
        return props.children;
    }

});
