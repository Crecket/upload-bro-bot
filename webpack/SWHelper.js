const del = require('del');
const glob = require('glob');
const swPrecache = require('sw-precache');

// folder constants
const PUBLIC_DIR = 'public';
const CLIENT_DIR = 'client';

// export the plugin
const SWHelper = (customFilesList = false) => {
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

    if (customFilesList) {
        // merge the afterEmitFiles list and remove duplicates
        staticFiles = [...new Set(staticFiles.concat(customFilesList))];
    } else {
        // list all the files in the build folder
        let distFolder = glob.sync(PUBLIC_DIR + "/assets/dist/!(*.map)");
        // add them to the list without duplicates
        staticFiles = [...new Set(staticFiles.concat(distFolder))];
    }

    // generate a list of all the server-side views
    const ServerViews = glob.sync('src/Resources/Views/**/*.twig')

    // write the precache file
    swPrecache.write(PUBLIC_DIR + '/sw.js', {
        staticFileGlobs: staticFiles,
        stripPrefix: PUBLIC_DIR,
        dynamicUrlToDependencies: {
            '/': ServerViews.concat([
                CLIENT_DIR + "/Pages/Dashboard.jsx"
            ]),
            '/dashboard': ServerViews.concat([
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

module.exports = SWHelper;

// if RUN is set as a env variable, run the helper
// E.G. `cross-env RUN_HELPER=1 node webpack/SWHelper.js`
if(process.env.RUN_HELPER){
    SWHelper();
}
