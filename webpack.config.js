const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

var BUILD_DIR = path.resolve(__dirname, 'public/assets');
var SRC_DIR = path.resolve(__dirname, 'src/Resources');

// env variable check
var DEV = process.env.NODE_ENV !== "production";

var config = {
    entry: {
        // react app js
        "app": SRC_DIR + '/React/react-app.jsx',
    },
    output: {
        path: BUILD_DIR,
        filename: '[name].js',
        chunkFilename: "[id].js"
    },
    resolve: {
        extensions: ['', '.jsx', '.scss', '.js', '.json', '.css'],  // along the way, subsequent file(s) to be consumed by webpack
        modulesDirectories: [
            'node_modules',
            path.resolve(__dirname, './node_modules')
        ]
    },
    plugins: [
        new webpack.NoErrorsPlugin(),
        new ExtractTextPlugin("[name].css", {
            allChunks: true
        }),
        new webpack.DefinePlugin({
            "PRODUCTION_MODE": process.env.NODE_ENV === "production" ? true : false,
            "DEVELOPMENT_MODE": process.env.NODE_ENV === "production" ? false : true,
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
        }),
    ],
    devtool: "source-map",
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                include: SRC_DIR,
                exclude: /node_modules/,
                query: {
                    plugins: ['react-html-attrs', 'transform-class-properties', 'transform-decorators-legacy'],
                }
            }, {
                test: /\.json$/,
                loader: 'json-loader'
            }, {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract(
                    "style-loader",
                    "css-loader?sourceMap",
                    "csso-loader?sourceMap"
                )
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract(
                    "style-loader",
                    "css-loader?sourceMap",
                    "sass-loader?sourceMap",
                    "csso-loader?sourceMap"
                )
            }
        ]
    }
}

if (!DEV) {
    // In production mode add the uglify plugin
    config.plugins.push(new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        }
    }))
}

module.exports = config;
