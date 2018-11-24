import rollupPluginBabel from "rollup-plugin-babel";

const input = 'raw/index.js';

export default [
    {
        input,
        output: {
            format: 'esm',
            file: 'dist/hyper-ui.js'
        }
    },
    {
        input,
        plugins: [
            rollupPluginBabel()
        ],
        output: {
            format: 'umd',
            name: 'HUI',
            file: 'dist/hyper-ui.umd.js'
        }
    }
];
