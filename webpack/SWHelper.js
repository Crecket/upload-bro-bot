const del = require("del");
const glob = require("glob");
const swPrecache = require("sw-precache");

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
    if (!process.env.DISABLE_STATIC) {
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

    // a list of client-side dependencies whic hare always required
    const GeneralClientDependencies = [
        CLIENT_DIR + "/Components/Sub/Loader.jsx",
        CLIENT_DIR + "/Components/Sub/TitleBar.jsx",
        CLIENT_DIR + "/Components/Sub/NavLink.jsx",
        CLIENT_DIR + "/Components/MainAppbar.jsx",
        CLIENT_DIR + "/Components/Main.jsx",
        CLIENT_DIR + "/Store.jsx"
    ];

    // these should be used for all dynamic lists
    const dynamicDependencies = ServerViews.concat(GeneralClientDependencies);

    // write the precache file
    swPrecache.write(
        PUBLIC_DIR + "/sw.js",
        {
            staticFileGlobs: staticFiles,
            stripPrefix: PUBLIC_DIR,
            dynamicUrlToDependencies: {
                "/": dynamicDependencies.concat([
                    CLIENT_DIR + "/Pages/Home.jsx"
                ]),
                "/dashboard": dynamicDependencies.concat([
                    CLIENT_DIR + "/Pages/Dashboard.jsx"
                ])
            },
            navigateFallback: "/",
            navigateFallbackWhitelist: [/\/remove\/.+/, /\/new\/.+/],
            runtimeCaching: [
                {
                    // dont cache api requests
                    urlPattern: /\/api/,
                    handler: "networkOnly"
                },
                {
                    //
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
                    handler: "cacheFirst"
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
