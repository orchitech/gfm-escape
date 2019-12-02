import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import pkg from './package.json';

export default [
  {
    input: 'src/GfmEscape.js',
    plugins: [
      commonjs(),
      resolve(),
      babel({
        exclude: ['node_modules/**', 'tools/output/**', 'src/utils/**'],
      }),
    ],
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' },
      { file: pkg.browser, name: 'gfmescape', format: 'umd' },
    ],
  },
];
