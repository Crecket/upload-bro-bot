const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const Logger = require('../client/Helpers/Logger.js');
const path = require('path');

// debug mode
const DEBUG = process.env.NODE_ENV !== "production";

// root project folder
const ROOT_FOLDER = path.join(__dirname, '../').replace(/\\/g, "/");

// view files used in the index page
const INDEX_VIEWS = [ROOT_FOLDER + 'src/Resources/Views/bootstrap.twig', ROOT_FOLDER + 'src/Resources/Views/index.twig'];

// module.exports = new SWPrecacheWebpackPlugin();
module.exports = new SWPrecacheWebpackPlugin({
    cacheId: require('../package.json').name,
    filename: 'sw.js',
    directoryIndex: '/',
    // enviroment modifiers
    minify: !DEBUG,
    forceDelete: !DEBUG,
    // ignore .map files
    // staticFileGlobsIgnorePatterns: [/\.map$/],
    // max file size
    maximumFileSizeToCacheInBytes: 4194304,
    mergeStaticsConfig: true,
    // dynamic handlers which happen at run time
    runtimeCaching: [
        {handler: 'networkOnly', urlPattern: /\/api\/$/,},
        {handler: 'cacheFirst', urlPattern: /[.]json$/,},
        {handler: 'cacheFirst', urlPattern: /[.]mp3$/,},
        {handler: 'cacheFirst', urlPattern: /[.]jpg$/,},
        {handler: 'cacheFirst', urlPattern: /[.]png$/,},
        {handler: 'cacheFirst', urlPattern: /[.]svg$/,}
    ],
    logger: Logger.log,
    // automatically verify the / route for changes
    dynamicUrlToDependencies: {
        '/': INDEX_VIEWS
    },
    // our custom scripts
    importScripts: [
        // push notifications
        // '/assets/dist/swcustom.js',
        // '/assets/js/PushNotifications.js',
    ],
    // remove the public folder structure
    stripPrefix: path.join(__dirname, '../public').replace(/\\/g, "/"),
    // static file paths we always want to cache
    staticFileGlobs: [
        // general important files
        '/',
        '/robots.txt',
        '/manifest.json',
        '/browserconfig.xml',
        // images we always want to cache
        '/favicon-32x32.png',
        '/favicon-16x16.png',
        '/public/assets/img/google.svg',
        '/public/assets/img/imgur.svg',
        '/public/assets/img/dropbox.svg',
        // other assets
        '/public/assets/img/*.ico',
        '/public/assets/img/*.jpg',
        '/public/assets/img/*.png',
        '/public/assets/img/*.svg',
        '/public/assets/css/*.css',
        '/public/assets/js/*.js',
        // external files
        'https://fonts.googleapis.com/css?family=Roboto:300,400,500',
    ],
});