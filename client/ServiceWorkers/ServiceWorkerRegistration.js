const Logger = require('./../Helpers/Logger');
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').then(function (reg) {
        reg.onupdatefound = function () {
            var installingWorker = reg.installing;
            installingWorker.onstatechange = function () {
                switch (installingWorker.state) {
                    case 'installed':
                        if (navigator.serviceWorker.controller) {
                            Logger.log('New or updated content is available.');
                        } else {
                            Logger.log('Content is now available offline!');
                        }
                        break;
                    case 'redundant':
                        Logger.error('The installing service worker became redundant.');
                        break;
                }
            };
        };
    }).catch(function (e) {
        Logger.error('Error during service worker registration:', e);
    });
}