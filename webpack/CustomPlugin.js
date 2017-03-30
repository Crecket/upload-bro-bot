const del = require('del');
const glob = require('glob');
const swPrecache = require('sw-precache');

// folder constants
const PUBLIC_DIR = 'public';
const SRC_DIR = 'src';
const CLIENT_DIR = 'client';
const VIEW_DIR = 'src/Resources/Views';
const WEBPACK_DIST_DIR = PUBLIC_DIR + '/assets/dist';

// debug mode?
let DEBUG = false;

// global variable to store the emitted files
let afterEmitFiles = [];

// delete all the dist files
const deleteBuildFiles = (callback) => {
    del([
        "public/assets/dist/**/*",
        "!public/assets/dist",
        "!public/assets/dist/.gitkeep"
    ]).then((paths) => {
        if (DEBUG) {
            console.log('Removed the following files');
            console.log(paths.join("\n"));
        }
        if (callback) callback();
    }).catch(console.log);
}

// export the plugin
module.exports = class SwPrecache {
    constructor(options = {}) {
        DEBUG = options.debug ? options.debug : false;
    }

    apply(compiler) {
        // run event to clear old files
        // compiler.plugin('run', this.run);

        // after emit to fetch the new file locations
        compiler.plugin('after-emit', this.afterEmit);

        // done event to create a new updated service worker
        compiler.plugin('done', this.done);

        // remove the files onces
        deleteBuildFiles();
    }

    afterEmit(compilation, callback) {
        // reset the after emit list
        afterEmitFiles = [];

        // Explore each chunk (build output):
        compilation.chunks.forEach(function (chunk) {
            // Explore each module within the chunk (built inputs):
            chunk.files.forEach(function (file) {
                // push this file to the list
                afterEmitFiles.push(PUBLIC_DIR + "/" + file);
            });
        });

        callback();
    }

    run(Compiler, callback) {
        deleteBuildFiles(callback);
    }

    // compilation has finished
    done(stats) {
        // default static files
        let staticFiles = [
            'https://fonts.googleapis.com/css?family=Roboto:300,400,500',
            // general important files
            '/robots.txt',
            '/manifest.json',
            '/browserconfig.xml'
        ];

        // all images in assets folder
        staticFiles = staticFiles.concat(
            glob.sync(PUBLIC_DIR + '/**/*.{png,svg,jpg,gif,ico}')
        );
        // merge the afterEmitFiles list and remove duplicates
        staticFiles = [...new Set(staticFiles.concat(afterEmitFiles))];

        // generate a list of all the server-side views
        const ServerViews = glob.sync('src/Resources/Views/**/*.twig')

        // write the precache file
        swPrecache.write(PUBLIC_DIR + '/sw.js', {
            staticFileGlobs: staticFiles,
            stripPrefix: PUBLIC_DIR,
            dynamicUrlToDependencies: {
                '/': ServerViews.concat([
                    SRC_DIR + "/PreRender.js",
                    CLIENT_DIR + "/Pages/Dashboard.jsx"
                ]),
                '/dashboard': ServerViews.concat([
                    SRC_DIR + "/PreRender.js",
                    CLIENT_DIR + "/Pages/Dashboard.jsx"
                ])
            },
            navigateFallback: '/',
            navigateFallbackWhitelist: [
                // /\/login\/((?!(telegram))\w)*\/callback/,
                /\/remove\/.+/,
                /\/new\/.+/,
            ],
            runtimeCaching: [
                {
                    urlPattern: /\/login\/telegram.+/,
                    handler: 'networkFirst'
                }, {
                    urlPattern: /\/pre-render-router-sw/,
                    handler: 'cacheFirst'
                }, {
                    urlPattern: /\/api/,
                    handler: 'networkOnly'
                }, {
                    urlPattern: /[.]?(js|css|json|html|map)/,
                    handler: 'networkFirst'
                }, {
                    urlPattern: /[.]?(png|jpg|svg|gif|jpeg|woff|woff2|ttf|eot)/,
                    handler: 'cacheFirst'
                }
            ]
        }, () => {
            // finished writing service worker
        });

    }
}

