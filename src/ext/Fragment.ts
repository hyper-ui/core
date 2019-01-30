import { define } from "../core/registry";
import { Store } from "../core/Store";

export interface FragmentProps {
    children: unknown;
}

export const Fragment = define<FragmentProps, Store<{}>, Store<{}>>('HUI.Fragment', {
    render: function frag_render(props) {
        return props.children;
    }
});
