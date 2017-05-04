const Logger = require("./../Helpers/Logger");

/**
 * Sends a message to the service worker
 * @param message
 */
const sendSwMessage = (message, callback = () => {}) => {
    if (navigator.serviceWorker.controller) {
        // create a new message channel for bi-directional communication
        const messageChannel = new MessageChannel();

        // set callback for onmessage listener
        messageChannel.port1.onmessage = callback;

        // post the message to the service worker
        navigator.serviceWorker.controller.postMessage(message, [
            messageChannel.port2
        ]);
    }
};

window.sendSwMessage = sendSwMessage;
window.clearSw = () => {
    sendSwMessage({ type: "CLEAR_ALL" }, message =>
        console.debug(message.data)
    );
};
window.clearSw = path => {
    sendSwMessage(
        {
            type: "REFRESH_CACHE",
            url: path
        },
        message => console.debug(message.data)
    );
};

// check if service workers are supported
if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
    // load the service worker
    navigator.serviceWorker
        .register("/sw.js")
        .then(registration => {
            // onupdate event listener
            registration.onupdatefound = function() {
                var installingWorker = registration.installing;
                // on change listener
                installingWorker.onstatechange = () => {
                    // check the state change type
                    switch (installingWorker.state) {
                        case "installed": {
                            let messageContents = "";
                            // differentiate between a new worker and first install
                            if (navigator.serviceWorker.controller) {
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
            Logger.error("Error during service worker registration:");
            Logger.error(e);
        });
}
