'use strict';

const chalk = require('chalk');
const path = require('path');
const { rollup } = require('rollup');
const babel = require('rollup-plugin-babel');
const replace = require('rollup-plugin-replace');
const commonjs = require('rollup-plugin-commonjs');
const resolve = require('rollup-plugin-node-resolve');
const uglify = require('rollup-plugin-uglify');
const { minify } = require('uglify-es');
const sizes = require('../../carbon-build/rollup/plugins/sizes-plugin');
const stats = require('../../carbon-build/rollup/stats');

const entry = path.resolve(__dirname, '../src/index.js');
// const entry = path.resolve(__dirname, '../_demo/index.js');
const babelConfig = {
  babelrc: false,
  presets: [
    [
      'env',
      {
        modules: false,
        targets: {
          browsers: ['last 1 versions', 'Firefox ESR'],
        },
      },
    ],
    'stage-1',
    'react',
  ],
  plugins: ['dev-expression', 'external-helpers'],
};

const external = [
  'classnames',
  'flatpickr',
  'lodash.debounce',
  'lodash.isequal',
  'window-or-global',
  'react',
  'carbon-icons',
  'prop-types',
  'warning',
];

const bundles = [
  // {
  // filename: 'carbon-react.development',
  // input: entry,
  // external,
  // plugins: [
  // babel({
  // ...babelConfig,
  // exclude: 'node_modules/**',
  // }),
  // resolve(),
  // commonjs({
  // include: /node_modules/,
  // }),
  // replace({
  // 'process.env.NODE_ENV': JSON.stringify('development'),
  // }),
  // ],
  // format: 'cjs',
  // },
  // {
  // filename: 'carbon-react.production',
  // input: entry,
  // external,
  // plugins: [
  // babel({
  // ...babelConfig,
  // exclude: 'node_modules/**',
  // }),
  // resolve(),
  // commonjs({
  // include: /node_modules/,
  // }),
  // replace({
  // 'process.env.NODE_ENV': JSON.stringify('production'),
  // }),
  // uglify(),
  // ],
  // format: 'cjs',
  // },
  // {
  // filename: 'carbon-react.development',
  // input: entry,
  // external,
  // plugins: [
  // babel({
  // ...babelConfig,
  // exclude: 'node_modules/**',
  // }),
  // resolve(),
  // commonjs({
  // include: /node_modules/,
  // }),
  // replace({
  // 'process.env.NODE_ENV': JSON.stringify('development'),
  // }),
  // ],
  // format: 'es',
  // },
  // {
  // filename: 'carbon-react.production',
  // input: entry,
  // external,
  // plugins: [
  // babel({
  // ...babelConfig,
  // exclude: 'node_modules/**',
  // }),
  // resolve(),
  // commonjs({
  // include: /node_modules/,
  // }),
  // replace({
  // 'process.env.NODE_ENV': JSON.stringify('production'),
  // }),
  // uglify({}, minify),
  // ],
  // format: 'es',
  // },
  {
    name: 'CarbonReact',
    filename: 'carbon-react.development',
    input: entry,
    globals: {
      react: 'React',
    },
    external: ['react'],
    plugins: [
      babel({
        ...babelConfig,
        exclude: 'node_modules/**',
      }),
      resolve(),
      commonjs({
        include: /node_modules/,
      }),
      replace({
        'process.env.NODE_ENV': JSON.stringify('development'),
      }),
    ],
    format: 'umd',
  },
  // {
  // name: 'CarbonReact',
  // filename: 'carbon-react.production',
  // input: entry,
  // globals: {
  // react: 'React',
  // },
  // external: ['react'],
  // plugins: [
  // babel({
  // ...babelConfig,
  // exclude: 'node_modules/**',
  // }),
  // resolve(),
  // commonjs({
  // include: /node_modules/,
  // }),
  // replace({
  // 'process.env.NODE_ENV': JSON.stringify('production'),
  // }),
  // uglify(),
  // ],
  // format: 'umd',
  // },
];

const steps = bundles.map(bundle => {
  const { globals, name, filename, input, external, plugins, format } = bundle;
  return rollup({
    input,
    external,
    plugins: [
      ...plugins,
      sizes({
        getSize: (size, gzip) => {
          stats.currentBuildResults.bundleSizes[`${format}.${filename}`] = {
            size,
            gzip,
          };
        },
      }),
    ],
  })
    .then(result => {
      const prefix = format === 'cjs' ? 'lib' : format;
      const options = {
        format,
        file: path.resolve(__dirname, `../${prefix}/${filename}.js`),
      };
      if (format === 'umd') {
        options.name = name;
        options.globals = globals;
      }
      return result.write(options);
    })
    .then(() => {
      console.log(chalk.green(`✅  ${format}/${filename}.js`));
    });
});

Promise.all(steps)
  .then(() => {
    stats.saveResults();
    console.log(stats.printResults());
  })
  .catch(error => console.log(error));
