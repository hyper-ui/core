import { define } from "./registry";
import { _document, _Symbol } from "./refCache";

export interface FragmentProps {
    children: unknown[];
}

export const fragmentSymbol = define<FragmentProps, {}, {}>('HUI.Fragment', {
    render: function (props) {
        return props.children;
    }
});
