const fs = require("fs");
const del = require("del");
const glob = require("glob");
const swPrecache = require("sw-precache");

// disable cache for static files and use network only for generic files
const DISABLE_STATIC = process.env.DISABLE_STATIC === "1";

// folder constants
const PUBLIC_DIR = "public";
const CLIENT_DIR = "client";

// export the plugin
const SWHelper = (customFilesList = false, DEBUG = true) => {
    // default static files
    let staticFiles = [
        // general important files
        "/robots.txt",
        "/manifest.json",
        "/browserconfig.xml"
    ];

    // all images in assets folder
    staticFiles = staticFiles.concat(
        glob.sync(PUBLIC_DIR + "/**/*.{png,svg,jpg,gif,ico}")
    );

    // if Disable static is set, don't cache webpack output
    if (DISABLE_STATIC === false) {
        if (customFilesList) {
            // merge the afterEmitFiles list and remove duplicates
            staticFiles = [...new Set(staticFiles.concat(customFilesList))];
        } else {
            // dont add .map files in production mode
            const distFolderGlob = DEBUG
                ? PUBLIC_DIR + "/assets/dist/*"
                : PUBLIC_DIR + "/assets/dist/!(*.map)";

            // list all the files in the build folder
            let distFolder = glob.sync(distFolderGlob);

            // add them to the list without duplicates
            staticFiles = [...new Set(staticFiles.concat(distFolder))];
        }
    }

    // generate a list of all the server-side views
    const ServerViews = glob.sync("src/Resources/Views/**/*.twig");
    const SitesFiles = glob.sync("src/Sites/**/*.js");

    // a list of client-side dependencies whic hare always required
    const GlobalClientComponents = [
        `${CLIENT_DIR}/Components/Sub/Loader.jsx`,
        `${CLIENT_DIR}/Components/Sub/TitleBar.jsx`,
        `${CLIENT_DIR}/Components/Sub/NavLink.jsx`,
        `${CLIENT_DIR}/Components/MainAppbar.jsx`,
        `${CLIENT_DIR}/Components/Main.jsx`,
        `${CLIENT_DIR}/Store.jsx`
    ];

    // combine these views since these are always required
    const globalList = [...ServerViews, ...GlobalClientComponents];

    // get last modified timestamp for our custom script
    const swCustomStat = fs.statSync(`${PUBLIC_DIR}/sw-custom.js`);

    // write the precache file
    swPrecache.write(
        PUBLIC_DIR + "/sw.js",
        {
            staticFileGlobs: staticFiles,
            stripPrefix: PUBLIC_DIR,
            // extra scripts we want to import into the service worker
            importScripts: [`/sw-custom.js?v=${swCustomStat.mtime.getTime()}`],
            // dynamic routes and their linked dependencies
            dynamicUrlToDependencies: {
                "/": [
                    ...globalList,
                    ...SitesFiles,
                    `${CLIENT_DIR}/Pages/Home.jsx`,
                    `${CLIENT_DIR}/Components/YoutubePreview.jsx`,
                    `${CLIENT_DIR}/Components/FeatureList.jsx`,
                    `${CLIENT_DIR}/Components/SiteList.jsx`
                ],
                "/dashboard": [
                    ...globalList,
                    `${CLIENT_DIR}/Pages/Dashboard.jsx`
                ],
                "/shell": globalList
            },
            // fallback certain routes to the /shell page
            navigateFallback: "/shell",
            navigateFallbackWhitelist: [/^\/remove\/:type/, /^\/new\/:type/],
            // runtimeCaching which matches patterns and applices the specific handlers
            runtimeCaching: [
                {
                    // dont cache api requests
                    urlPattern: /\/api/,
                    handler: "networkOnly"
                },
                {
                    // don't cache google analytics
                    urlPattern: /https:\/\/www\.google-analytics\.com.*/,
                    handler: "networkOnly"
                },
                {
                    // try network first but fallback to showing the cached page when offline
                    urlPattern: /\/login\/telegram.+/,
                    handler: "networkFirst"
                },
                {
                    // for debug purposes we want to load maps from network first when we can
                    urlPattern: /[.]?(map)/,
                    handler: "networkFirst"
                },
                {
                    urlPattern: /[.]?(html|js|css|json|png|jpg|svg|gif|jpeg|woff|woff2|ttf|eot)/,
                    handler: DISABLE_STATIC ? "networkFirst" : "cacheFirst"
                },
                {
                    // fonts don't update and we don't want it delaying our app
                    urlPattern: /https:\/\/fonts\.googleapis\.com\/.*/,
                    handler: "cacheFirst"
                }
            ]
        },
        () => {
            // finished writing service worker
        }
    );
};

module.exports = SWHelper;

// if RUN is set as a env variable, run the helper
// E.G. `cross-env RUN_HELPER=1 node webpack/SWHelper.js`
if (process.env.RUN_HELPER) {
    SWHelper();
}
