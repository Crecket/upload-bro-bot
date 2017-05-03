const Logger = require("./../Helpers/Logger");

// polyfill the trigger update
window.triggerUpdate = () => false;

// check if service workers are supported
if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
    // load the service worker
    navigator.serviceWorker
        .register("/sw.js")
        .then(registration => {
            // manually trigger a service worker update
            window.triggerUpdate = () => {
                registration.update();
                return true;
            };

            // onupdate event listener
            registration.onupdatefound = function () {
                var installingWorker = registration.installing;
                // on change listener
                installingWorker.onstatechange = () => {
                    // check the state change type
                    switch (installingWorker.state) {
                        case "installed": {
                            let messageContents = "";
                            // differentiate between a new worker and first install
                            if (navigator.serviceWorker.controller) {

                                navigator.serviceWorker.controller.postMessage("hi");

                                messageContents =
                                    "The page has been updated and is now available offline!";
                            } else {
                                messageContents =
                                    "The page has been saved and is now available offline!";
                            }
                            // log the contents and create a notifcation
                            Logger.debug(messageContents);
                            if (window.showSnackbar)
                                window.showSnackbar(messageContents);
                            break;
                        }

                        case "redundant": {
                            Logger.error(
                                "The installing service worker became redundant."
                            );
                            break;
                        }
                    }
                };
            };
        })
        .catch(e => {
            Logger.error("Error during service worker registration:", e);
        });
}
