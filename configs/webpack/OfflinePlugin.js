const OfflinePlugin = require("offline-plugin");

module.exports = new OfflinePlugin({
    publicPath: "/",
    autoUpdate: true,
    externals: [
        // general important files
        '/',
        '/robots.txt',
        '/manifest.json',
        '/browserconfig.xml',
        // unages
        '/favicon-32x32.png',
        '/favicon-16x16.png',
        '/assets/img/google.svg',
        '/assets/img/imgur.svg',
        '/assets/img/dropbox.svg',
        '/assets/img/google.png',
        '/assets/img/imgur.png',
        '/assets/img/dropbox.png',
        // icons/logos
        '/**/*.png',
        '/**/*.ico',
        '/**/*.jpg',
        '/**/*.svg',
        '/**/*.css',
        // external files
        'https://fonts.googleapis.com/css?family=Roboto:300,400,500',
    ],
    caches: {
        main: [
            ':rest:',
            ':externals:',
        ]
    },
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