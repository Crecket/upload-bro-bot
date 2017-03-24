const del = require('del');
const glob = require('glob');
const swPrecache = require('sw-precache');

// folder constants
const PUBLIC_DIR = 'public';
const VIEW_DIR = 'src/Resources/Views';
const WEBPACK_DIST_DIR = PUBLIC_DIR + '/assets/dist';

// export the plugin
module.exports = class SwPrecache {
    apply(compiler) {
        // register events
        compiler.plugin('compile', this.compile);
        compiler.plugin('done', this.done);
    }

    compile(params) {
        // delete old files before compile
        del([
            "public/sw.js",
            "public/assets/dist/**",
            "public/appcache/**",
            "public/appcache",
            "public/*.*.js",
            "public/*.*.map",
            "!public/assets/dist",
            "!public/assets/dist/.gitkeep"
        ]).then(paths => {
            // log?
        }).catch(err => {
            console.log(err);
        });
    }

    done(stats) {
        // create a new service worker when done
        console.log(stats.assets);

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

        // all files in the dist folder
        staticFiles = staticFiles.concat(
            glob.sync(WEBPACK_DIST_DIR + '/!(*.*.map)')
        );

        // write the precache file
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
                    urlPattern: /[.]?(js|css|json|html|map)/,
                    handler: 'networkFirst'
                }, {
                    urlPattern: /[.]?(png|jpg|svg|gif|jpeg|woff|woff2|ttf|eot)/,
                    handler: 'cacheFirst'
                }
            ]
        }, (res) => {
            // finished writing file

        });

    }
}

