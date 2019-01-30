import { define } from "../core/registry";
import { EmptyStore } from "../core/Store";

export interface FragmentProps {
    children: unknown;
}

export const Fragment = define<FragmentProps, EmptyStore, EmptyStore>('HUI.Fragment', {
    render: function frag_render(props) {
        return props.children;
    }
});
