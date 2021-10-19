const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const PORT = 3000;
const IP = '0.0.0.0';

const resolve = (...rest) => path.join(__dirname, ...rest);
const devtool = 'source-map';

module.exports = {
    mode: 'development',
    entry: {
        main: './src/index.js'
    },
    output: {
        path: resolve('dev'),
        filename: './js/[name].js',
        chunkFilename: './js/[name].js',
    },
    devtool,
    devServer: {
        host: IP,
        port: PORT,
        open: false,
        hot: true,
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            template: 'index.html',
            filename: 'index.html',
            inject: true,
            hash: true,
        })
    ],
    stats: {
        assets: false,
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        warnings: false,
    }
}