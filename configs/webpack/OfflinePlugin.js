const OfflinePlugin = require("offline-plugin");

module.exports = new OfflinePlugin({
    publicPath: "/",
    autoUpdate: true,
    externals: [
        '/',
        '/assets/img/**.png',
        '/assets/img/google.png',
        '/assets/img/dropbox.png',
        '/assets/img/imgur.png',
    ],
    excludes: [
        "/api/**",
        "/login/**",
        "/login/telegram",
    ],
    // ServiceWorker: {
    //     navigateFallbackURL: "/"
    // },
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