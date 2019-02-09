import rollupPluginBabel from "rollup-plugin-babel";

const input = 'raw/index.js';

export default [
    {
        input,
        plugins: [
            rollupPluginBabel()
        ],
        output: {
            format: 'umd',
            name: 'HUI',
            file: 'dist/hyper-ui.core.umd.js'
        }
    },
    {
        input,
        output: {
            format: 'esm',
            file: 'dist/hyper-ui.core.js'
        }
    }
];
