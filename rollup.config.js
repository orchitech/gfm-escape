import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import pkg from './package.json';

export default [
  {
    input: 'src/GfmEscape.js',
    external: ['union-replacer'],
    plugins: [
      commonjs(),
      resolve(),
      babel({
        exclude: ['node_modules/**', 'tools/output/**'],
        comments: false,
        presets: [
          [
            '@babel/env', {
              modules: false,
              targets: {
                browsers: '> 1%, IE 11, not op_mini all, not dead',
                node: 8,
                esmodules: false,
              },
              useBuiltIns: false,
              loose: true,
            },
          ],
        ],
      }),
    ],
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' },
      {
        file: pkg.browser,
        name: 'GfmEscape',
        format: 'umd',
        globals: { 'union-replacer': 'UnionReplacer' },
      },
    ],
  },
];
