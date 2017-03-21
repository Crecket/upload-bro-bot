"use strict";

const del = require('del');
const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const SRC_DIR = path.resolve(__dirname, 'client');
const BUILD_DIR = path.resolve(__dirname, 'public');

// env variable check
const DEV = process.env.NODE_ENV !== "production";

// clear old files
del(['public/assets/dist/**', '!public/assets/dist', '!public/assets/dist/.gitkeep']).then(paths => {
    if (DEV) {
        console.log("\n");
        console.log('Cleared dist folder:\n', paths.join('\n'));
        console.log("\n");
    }
});

let config = {
    entry: {
        // React app
        "assets/dist/app": SRC_DIR + '/react-app.jsx',
        // Service worker
        "service-worker": SRC_DIR + '/service-worker.js'
    },
    output: {
        path: BUILD_DIR,
        filename: '[name].js',
        publicPath: '/assets/dist/',
        chunkFilename: "/assets/dist/[name].[hash].js"
    },
    resolve: {
        extensions: ['.jsx', '.scss', '.js', '.json', '.css'],
        modules: [
            'node_modules',
            path.resolve(__dirname, './node_modules'),
            path.resolve(__dirname, './src'),
        ]
    },
    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new ExtractTextPlugin({
            filename: "assets/dist/[name].css",
            disable: false,
            allChunks: true
        }),
        new webpack.DefinePlugin({
            "PRODUCTION_MODE": JSON.stringify(process.env.NODE_ENV === "production" ? true : false),
            "DEVELOPMENT_MODE": JSON.stringify(process.env.NODE_ENV === "production" ? false : true),
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
        }),
        new webpack.optimize.CommonsChunkPlugin({
            // (the commons chunk name)
            name: "commons",
            // (the filename of the commons chunk)
            filename: "assets/dist/commons.js",
            // (Modules must be shared between 3 entries)
            minChunks: 2
        })
    ],
    devtool: DEV ? "source-map" : false,
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        plugins: [
                            'react-html-attrs',
                            'transform-class-properties',
                            'transform-react-inline-elements',
                            'transform-react-constant-elements',
                            'transform-decorators-legacy'
                        ]
                    }
                }]
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader!sass-loader"
                })
            }
        ]
    }
}

// production only plugins
if (!DEV) {
    // uglify plugin
    config.plugins.push(new webpack.optimize.UglifyJsPlugin({
        sourceMap: true,
        minimize: true,
        compress: {
            warnings: false
        }
    }));
}

module.exports = config;
