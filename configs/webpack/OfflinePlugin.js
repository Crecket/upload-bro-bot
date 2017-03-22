const OfflinePlugin = require("offline-plugin");

module.exports = new OfflinePlugin({
    publicPath: "/",
    autoUpdate: true,
    externals: [
        // general important files
        '/',
        '/manifest.json',
        // icons
        '/assets/img/**.png',
        '/assets/img/**.svg',
        '/assets/img/google.png',
        '/assets/img/google.svg',
        '/assets/img/dropbox.png',
        '/assets/img/dropbox.svg',
        '/assets/img/imgur.png',
        '/assets/img/imgur.svg',
        // external files
        'https://fonts.googleapis.com/css?family=Roboto:300,400,500',
    ],
    excludes: [
        "/api/**",
        "/new/**",
        "/login/**",
        "/login/telegram",
    ],
    ServiceWorker: {
        // navigateFallbackURL: "/",
        prefetchRequest: {}
    },
    AppCache: {
        FALLBACK: {
            "/remove/dropbox": "/",
            "/remove/imgur": "/",
            "/remove/google": "/",
            "/login/dropbox/callback": "/",
        }
    },
    // cacheMaps: [
    //     {
    //         match: function (url) {
    //             if (url.origin !== location.origin) return;
    //             if (url.pathname.indexOf('/api/') === 0) return;
    //             return new URL('/', location);
    //         },
    //         to: "/",
    //         requestTypes: ["navigate"]
    //     }
    // ],
});