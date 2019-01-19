import { define } from "../core/registry";
import { _document, _Symbol } from "../utils/refCache";

export interface FragmentProps {
    children: unknown;
}

export const fragmentSymbol = define<FragmentProps, {}, {}, {}, {}>('HUI.Fragment', {
    render: function fragment_render(props) {
        return props.children;
    }
});
