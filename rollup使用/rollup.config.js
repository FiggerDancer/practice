const rollup = require('rollup');
const path = require('path');
const { nodeResolve } = require('@rollup/plugin-node-resolve'); // nodejs引入
const { babel } = require('@rollup/plugin-babel'); // babel转化
const commonjs = require('@rollup/plugin-commonjs'); // commonjs按照es6的方式可以引入
const typescript = require('@rollup/plugin-typescript'); // 将ts转义为es
const { terser } = require('rollup-plugin-terser'); // 代码压缩
const postcss = require('rollup-plugin-postcss'); // 引入css
const serve = require('rollup-plugin-serve'); // 启动服务
const livereload = require('rollup-plugin-livereload'); // 热更新

const umdOutputOptions = {
    name: 'umd',
    file: path.resolve(__dirname, './dist/bundle.umd.js'),
    format: 'umd',
    globals: {
        'jquery': '$',
        'lodash': '_',
    },
    sourcemap:true  //生成bundle.map.js文件，方便调试
}

const cjsOutputOptions = {
    name: 'cjs',
    file: path.resolve(__dirname, './dist/bundle.cjs.js'),
    format: 'cjs',
    globals: {
        'jquery': '$',
        'lodash': '_',
    },
    sourcemap:true  //生成bundle.map.js文件，方便调试
}

const iifeOutputOptions = {
    name: 'iife',
    file: path.resolve(__dirname, './dist/bundle.iife.js'),
    format: 'iife',
    globals: {
        'jquery': '$',
        'lodash': '_',
    },
    sourcemap:true  //生成bundle.map.js文件，方便调试
}

const esOutputOptions = {
    name: 'es',
    file: path.resolve(__dirname, './dist/bundle.es.js'),
    format: 'es',
    globals: {
        'jquery': '$',
        'lodash': '_',
    },
    sourcemap: true,
}

const output = [
    umdOutputOptions,
    cjsOutputOptions,
    esOutputOptions,
    iifeOutputOptions,
];

export default {
    input: path.resolve(__dirname, './main.ts'),
    external: ['lodash'],
    plugins: [
        typescript({
            tsconfig: path.resolve(__dirname, './tsconfig.json'), // 导入本地ts配置
        }),
        nodeResolve({
            extensions: [
                '.js',
                '.ts',
                '.tsx'
            ]
        }),
        commonjs(),
        babel({
            babelHelpers: 'bundled',
            // addExternalHelpersPlugin: false,
            exclude: /node_modules/,
        }),
        terser(),
        postcss(),
        livereload(),
        serve({
            open: true,
            openPage: '/dist/index.html',
            contentBase: ''
        })
    ],
    output,
}