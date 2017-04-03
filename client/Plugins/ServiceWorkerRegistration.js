const Logger = require('./../Helpers/Logger');
const Notification = require('./../Helpers/Notification');

// check if service workers are supported
if (typeof navigator !== "undefined" && 'serviceWorker' in navigator) {
    // load the service worker
    navigator.serviceWorker.register('/sw.js').then(function (reg) {
        reg.onupdatefound = function () {
            var installingWorker = reg.installing;

            // on change listener
            installingWorker.onstatechange = function () {
                // check the state change type
                switch (installingWorker.state) {
                    case 'installed': {
                        let messageContents = "";
                        // differentiate between a new worker and first install
                        if (navigator.serviceWorker.controller) {
                            messageContents = 'New or updated content is available.';
                        } else {
                            messageContents = 'Content is now available offline!';
                        }
                        // if debug mode is enabled log this
                        if (process.env.DEBUG) {
                            // log the contents and create a notifcation
                            Logger.debug(messageContents);
                            Notification('ServiceWorkerChanged', messageContents + " Click to reload the page.")
                                .then(tempNotification => {
                                    // Wait for onclick event
                                    tempNotification.onclick = () => {
                                        // close the notification
                                        tempNotification.close();
                                        // reload the page
                                        location.reload();
                                    }
                                });
                        }
                        break;
                    }
                    case 'redundant': {
                        Logger.error('The installing service worker became redundant.');
                        break;
                    }
                }
            };
        };
    }).catch(function (e) {
        Logger.error('Error during service worker registration:', e);
    });
}
