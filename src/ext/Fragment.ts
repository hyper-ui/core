import { define } from "../core/registry";

export interface FragmentProps {
    children: unknown;
}

export const Fragment = define<FragmentProps, {}, {}, {}, {}>('HUI.Fragment', {
    render: function frag_render(props) {
        return props.children;
    }
});
