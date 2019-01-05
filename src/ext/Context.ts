import { _document, _Symbol } from "../utils/refCache";
import { define } from "../core/registry";

export interface ContextProps {
    key: any;
    value: any;
    children?: unknown[];
}

export const contextSymbol = define<ContextProps, {}, any>('HUI.Context', {

    init: function context_init(props, store, context) {
        context.set(props.key, props.value);
    },

    render: function context_render(props) {
        return props.children;
    }

});
