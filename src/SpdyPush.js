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
     * Send multiple files with the request
     *
     * @param pushEvents
     * @returns {Promise}
     */
    sendFiles(pushEvents) {
        return new Promise(resolve => {
            // if this isn't spdy, return false
            if (!this.request.isSpdy) return false;

            // check if sw-precache parameter is set, dont add push events if it is
            if (this.request.query["_sw-precache"]) return false;

            Logger.trace("Pushing file");

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
            Promise.all(PromiseList).then(resolve);
        });
    }

    /**
     * @param target_url
     * @param target_file
     * @param options
     * @returns {Promise.<void>}
     */
    push(target_url, target_file, options = {}) {
        return new Promise(resolve => {
            try {
                // create the push event with the target and options
                const stream = this.response.push(
                    // start push stream to target url
                    target_url,
                    // combine new options with default options
                    Object.assign({}, defaultPushHeaders, options)
                );

                // error handler
                stream.on("error", function(err) {
                    Logger.error(err);
                });

                // get file contents
                this.getFileContents(target_file)
                    // gzip the file contents
                    .then(file_contents => this._compressFile)
                    // end the stream with the file contents
                    .then(gzipped_contents => stream.end(gzipped_contents))
                    // error handler
                    .catch(Logger.error);
            } catch (ex) {
                Logger.error(ex);
            }
        });
    }

    /**
     * @param target_url
     * @param target_file
     * @param options
     * @returns {Promise.<void>}
     */
    push(target_url, target_file, options = {}) {
        return new Promise(resolve => {
            // default error handler
            const defaultErr = err => {
                Logger.error(err);
                resolve();
            };

            // create the push event with the target and options
            const pushstream = this.response.push(
                // start push stream to target url
                target_url,
                // combine new options with default options
                Object.assign({}, defaultPushHeaders, options)
            );
            pushstream.on("error", err => defaultErr);

            // get a read stream for the file location
            const filestream = fs.createReadStream(target_file);
            filestream.on("error", err => defaultErr);

            // create a gzip stream to pipe with
            const gzip = zlib.createGzip();
            gzip.on("error", err => defaultErr);

            // pipe the filestream through gzip into the pushstream
            filestream.pipe(gzip).pipe(pushstream);

            // handle the finish event
            pushstream.on("finish", resolve);
        });
    }
}

module.exports = PushHandler;
