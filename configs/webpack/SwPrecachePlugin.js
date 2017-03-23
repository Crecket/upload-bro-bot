const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const path = require('path');

const DEBUG = process.env.NODE_ENV !== "production";

const PUBLIC_FOLDER = path.join(__dirname, '../../public').replace(/\\/g,"/");

// module.exports = new SWPrecacheWebpackPlugin();
module.exports = new SWPrecacheWebpackPlugin({
    cacheId: require('../../package.json').name,
    filename: 'sw.js',
    // enviroment modifiers
    minify: !DEBUG,
    forceDelete: !DEBUG,
    verbose: DEBUG,
    // ignore .map files
    // staticFileGlobsIgnorePatterns: [/\.map$/],
    // max file size
    maximumFileSizeToCacheInBytes: 4194304,
    mergeStaticsConfig: true,
    // dynamic handlers which happen at run time
    runtimeCaching: [{
        handler: 'cacheFirst',
        urlPattern: /[.]mp3$/,
    }],
    stripPrefix: PUBLIC_FOLDER,
    // static file paths we always want to cache
    staticFileGlobs: [
        // general important files
        '/',
        '/robots.txt',
        '/manifest.json',
        '/browserconfig.xml',
        // images
        '/favicon-32x32.png',
        '/favicon-16x16.png',
        '/assets/img/google.svg',
        '/assets/img/imgur.svg',
        '/assets/img/dropbox.svg',
        // icons/logos
        // '/**/*.png',
        // '/**/*.ico',
        // '/**/*.jpg',
        // '/**/*.svg',
        // '/**/*.css',
        // external files
        'https://fonts.googleapis.com/css?family=Roboto:300,400,500',
    ],
});