/**
 * Replies to a message event through the MessageChannel
 * @param event
 * @param message
 */
const replyToMessage = (event, message) => {
    event.ports[0].postMessage(message);
};

/**
 * Store response object into the cache
 *
 * @param response
 * @param url
 * @param hash
 */
const storeCache = (response, url, hash) => {
    // get the correct cache
    getCacheStore()
        .then(cache => {
            // generate a identical cache key as the sw-precache library
            const cacheKey = createCacheKey(
                url.href,
                hashParamName,
                hash,
                false
            );

            // store the new cache response
            cache.put(cacheKey, response).catch(console.error);
        })
        .catch(console.error);
};

/**
 * Returns the sw-precache store
 */
const getCacheStore = () => {
    return caches.open(cacheName);
};

/**
 * Refresh a specific url in sw-precache
 * @param event
 * @returns {boolean}
 */
const refreshCacheItem = event => {
    // generate url helper from given event
    const url = new URL(event.data.url, self.location);

    // get the cache information from sw-precache lib
    const cacheItem = precacheConfig.find(item => {
        return item[0] === url.pathname;
    });

    // tell the client we failed
    if (!cacheItem) {
        replyToMessage(event, {
            success: false,
            message: `No existing cache item was found for ${url}`
        });
        return false;
    }

    // create a new request object
    const request = new Request(url, { credentials: "same-origin" });

    // do the request
    fetch(request)
        // store the response
        .then(response => storeCache(response, url, cacheItem[1]))
        // reply to the client
        .then(result =>
            replyToMessage(event, {
                success: true,
                message: `Updated cache item for ${url}`
            })
        );
};

/**
 * Event listener for messages from the client
 */
self.addEventListener("message", async event => {
    console.debug("Received message: ", event);

    // check what kind of event we received
    switch (event.data.type) {
        case "REFRESH_CACHE": {
            refreshCacheItem(event);
            break;
        }
        case "CLEAR_ALL": {
            try {
                // get the correct cache store
                const cache = await getCacheStore();
                // get all the cache keys
                const cacheKeys = await caches.keys();
                // remove them all
                const PromiseResult = await Promise.all(
                    cacheKeys.map(cacheKey =>
                        // delete the cacheKey and resolve its string value so the client knows which caches have been cleared
                        caches.delete(cacheKey).then(done => cacheKey)
                    )
                );

                replyToMessage(event, {
                    success: true,
                    message: `Cleared sw-precache cache`
                });
            } catch (ex) {
                replyToMessage(event, {
                    success: false,
                    message: `Failed to clear sw-precache cache`,
                    error: ex
                });
            }
            break;
        }
    }
});
