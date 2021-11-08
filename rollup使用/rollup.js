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

const inputOptions = {
    input: path.resolve(__dirname, './main.ts'),
    external: ['lodash'],
   
    plugins: [
        typescript({
            tsconfig: path.resolve(__dirname, './tsconfig.json'), // 导入本地ts配置
            sourceMap: true,
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
        // terser(),
        postcss(),
        livereload(),
        serve({
            open: true,
            openPage: '/dist/index.html',
            contentBase: ''
        })
    ],
}
const umdOutputOptions = {
    name: 'umd',
    file: './dist/bundle.umd.js',
    format: 'umd',
    globals: {
        'jquery': '$',
        'lodash': '_',
    },
    sourcemap:true  //生成bundle.map.js文件，方便调试
}

const cjsOutputOptions = {
    name: 'cjs',
    file: './dist/bundle.cjs.js',
    format: 'cjs',
    globals: {
        'jquery': '$',
        'lodash': '_',
    },
    sourcemap:true  //生成bundle.map.js文件，方便调试
}

const iifeOutputOptions = {
    name: 'iife',
    file: './dist/bundle.iife.js',
    format: 'iife',
    globals: {
        'jquery': '$',
        'lodash': '_',
    },
    sourcemap:true  //生成bundle.map.js文件，方便调试
}

const esOutputOptions = {
    name: 'es',
    file: './dist/bundle.es.js',
    format: 'es',
    globals: {
        'jquery': '$',
        'lodash': '_',
    },
    sourcemap: true,
}

const watchOptions = {
    ...inputOptions,
    output: [
        umdOutputOptions,
        cjsOutputOptions,
        iifeOutputOptions,
        esOutputOptions,
    ],
    watch: {
        skipWrite: false,
        clearScreen: false,
        include: '/**/*',
        exclude: 'node_modules/**',
        chokidar: {
            paths: '/**/*',
            usePolling: false
        }
    }
}

async function build() {
    const bundle = await rollup.rollup(inputOptions);

    console.log(bundle.imports);
    console.log(bundle.exports);
    console.log(bundle.modules);

    const { code: cjsCode, map: cjsMap } = await bundle.generate(cjsOutputOptions);
    const { code: umdCode, map: umdMap } = await bundle.generate(umdOutputOptions);
    const { code: iifeCode, map: iifeMap } = await bundle.generate(iifeOutputOptions);
    const { code: esCode, map: esMap } = await bundle.generate(esOutputOptions);

    const promises = Promise.all([bundle.write(cjsOutputOptions), bundle.write(umdOutputOptions), bundle.write(iifeOutputOptions), bundle.write(esOutputOptions)]);
    await promises;
}

async function start() {
    await build();
    const watcher = rollup.watch(watchOptions);
    watcher.on('event', (event) => {
        console.log('event:', event.code, event.output, event.input);
    // event.code 会是下面其中一个：
    //   START        — 监听器正在启动（重启）
    //   BUNDLE_START — 构建单个文件束
    //   BUNDLE_END   — 完成文件束构建
    //   END          — 完成所有文件束构建
    //   ERROR        — 构建时遇到错误
    //   FATAL        — 遇到无可修复的错误
    });
      
}

start();