"use strict";

const gulp = require('gulp');
const swPrecache = require('sw-precache');
const glob = require('glob');

// folder constants
const PUBLIC_DIR = 'public';
const VIEW_DIR = 'src/Resources/Views';
const WEBPACK_DIST_DIR = PUBLIC_DIR + '/assets/dist';

// the default gulp task which does the initial task and sets up a watcher
gulp.task('default', ['sw'], function (callback) {
    // update template list and run default task on change
    gulp.watch([
        VIEW_DIR + '/**/*.twig',
        WEBPACK_DIST_DIR + '/**.*'
    ], ['sw']);

    callback();
});

// the main service worker
gulp.task('sw', function (callback) {
    // default static files
    let staticFiles = [
        'https://fonts.googleapis.com/css?family=Roboto:300,400,500',
        // general important files
        '/robots.txt',
        '/manifest.json',
        '/browserconfig.xml'
    ];

    // all images in assets folder
    staticFiles = staticFiles.concat(glob.sync(PUBLIC_DIR + '/**/*.{png,svg,jpg,gif,ico}'));

    // all files in the dist folder
    staticFiles = staticFiles.concat(glob.sync(WEBPACK_DIST_DIR + '/**.*'));

    swPrecache.write(PUBLIC_DIR + '/sw.js', {
        staticFileGlobs: staticFiles,
        stripPrefix: PUBLIC_DIR,
        dynamicUrlToDependencies: {
            '/': [
                VIEW_DIR + '/index.twig',
                VIEW_DIR + '/bootstrap.twig'
            ],
        },
        runtimeCaching: [
            {
                urlPattern: /\/api/,
                handler: 'networkFirst'
            }, {
                urlPattern: /[.]?(js|css|json|html)/,
                handler: 'networkFirst'
            }, {
                urlPattern: /[.]?(png|jpg|svg|gif|jpeg|woff|woff2|ttf|eot)/,
                handler: 'cacheFirst'
            }
        ]
    }, callback);
});
