"use strict";
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");
const Logger = require("../client/Helpers/Logger");

// the default headers we tend to send
const defaultPushHeaders = {
    status: 200, // optional
    method: "GET", // optional
    request: {
        accept: "*/*"
    },
    response: {
        "content-type": "application/javascript",
        "content-encoding": "gzip"
    }
};

class PushHandler {
    /**
     * @param request
     */
    constructor(request, response) {
        // the express request object
        this.request = request;
        this.response = response;
    }

    /**
     * @param pushEvents
     * @returns {Promise.<*>}
     */
    sendFiles = async pushEvents => {
        // if this isn't spdy, return false
        if (!this.request.isSpdy) return false;

        // check if sw-precache parameter is set, dont add push events if it is
        if (this.request.query["_sw-precache"]) return false;

        Logger.debug('Pushing file');

        // loop through all the push events we want ot send
        const PromiseList = pushEvents.map(pushEvent => {
            // we want to use this push event
            return this.push(
                pushEvent.target_url,
                pushEvent.target_file,
                pushEvent.options
            );
        });

        // wait for all of them to finish
        return await Promise.all(PromiseList);
    };

    /**
     * @param target_url
     * @param target_file
     * @param options
     * @returns {Promise.<void>}
     */
    push = async (target_url, target_file, options = {}) => {
        try {
            // create the push event with the target and options
            const stream = this.response.push(
                // start push stream to target url
                target_url,
                // combine new options with default options
                Object.assign({}, defaultPushHeaders, options)
            );

            // get the file contents
            const file_contents = await new Promise(resolve => {
                fs.readFile(path.resolve(target_file), (err, result) =>
                    resolve(result)
                );
            });

            // get the file contents
            const gzipped_contents = await new Promise(resolve => {
                zlib.gzip(file_contents, (err, result) => resolve(result));
            });

            // create a read stream from file system and send the content
            stream.end(gzipped_contents);

            // error handler
            stream.on("error", function(err) {
                Logger.error(err);
            });
        } catch (ex) {
            Logger.error(ex);
        }
    };
}

module.exports = PushHandler;
