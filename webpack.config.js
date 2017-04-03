"use strict";
/* eslint-disable */
require('dotenv').config();

// dependencies
const path = require("path");
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// custom extension
const SWPlugin = require("./webpack/SWPlugin");

// src and build dirs
const SRC_DIR = path.resolve(__dirname, "client");
const BUILD_DIR = path.resolve(__dirname, "public");
const OUTPUT_DIR = "assets/dist/";

// env variable check
const DEV = process.env.NODE_ENV !== "production";

let config = {
    entry: {
        // React app
        "app": [
            "babel-polyfill", // promise polyfill
            SRC_DIR + "/react-app.jsx" // actual app
        ],
        // App css code
        "css-app": SRC_DIR + "/css-app.js",
        // Service worker registration
        "sw-register": SRC_DIR + "/Plugins/ServiceWorkerRegistration.js",
    },
    output: {
        path: BUILD_DIR,
        filename: OUTPUT_DIR + "[name].js",
        publicPath: process.env.WEBSITE_URL + "/",
        chunkFilename: OUTPUT_DIR + "[chunkhash].bundle.js"
    },
    resolve: {
        extensions: [".jsx", ".scss", ".js", ".json", ".css"],
        modules: [
            "node_modules",
            path.resolve(__dirname, "./node_modules"),
            path.resolve(__dirname, "./src"),
        ]
    },
    // devtool for source maps
    devtool: DEV ? "source-map" : "cheap-module-source-ma",
    plugins: [
        // stop emit if we get errors
        new webpack.NoEmitOnErrorsPlugin(),
        //extract any css files
        new ExtractTextPlugin({
            filename: OUTPUT_DIR + "[name].css",
            disable: false,
            allChunks: true
        }),
        // custom plugin
        new SWPlugin({
            debug: DEV
        }),
        // webpack analyzer
        new BundleAnalyzerPlugin({
            openAnalyzer: false,
            // create a server for the watcher or a static file for production enviroments
            analyzerMode: 'static',
            // output outside of the public folder
            reportFilename: '../webpack.report.html',
            /**
             * stats file for analyzer - use with:
             * @see https://alexkuz.github.io/stellar-webpack/
             * @see https://alexkuz.github.io/webpack-chart/
             */
            generateStatsFile: true,
            statsFilename: '../webpack.stats.json'
        }),
        // SwPrecachePlugin,
        new webpack.DefinePlugin({
            "PRODUCTION_MODE": JSON.stringify(!DEV),
            "DEVELOPMENT_MODE": JSON.stringify(DEV),
            "process.env.DEBUG": JSON.stringify(DEV),
            "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "development"),
            "process.env.WEBPACK_MODE": JSON.stringify(true)
        }),
        // split up common code into commons file
        new webpack.optimize.CommonsChunkPlugin({
            // (the commons chunk name)
            name: "commons",
            // (the filename of the commons chunk)
            filename: OUTPUT_DIR + "commons.js",
            // minimum shared locations before being added
            minChunks: 2
        })
    ],
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: [{
                    loader: "babel-loader"
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

if (!DEV) {
    // production only plugins

    // uglify plugin
    config.plugins.push(new webpack.optimize.UglifyJsPlugin({
        sourceMap: true,
        minimize: true,
        comments: false,
        compress: {
            warnings: false,
            drop_console: true
        }
    }));
} else {
    // development only plugins
}

module.exports = config;
