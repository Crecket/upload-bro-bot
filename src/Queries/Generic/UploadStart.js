const fs = require("fs");
const path = require("path");
const Logger = require("../../Helpers/Logger");
const HelperInterface = require("../../HelperInterface");

module.exports = class UploadStart extends HelperInterface {
    constructor(app) {
        super(app);

        this._app = app;
    }

    /**
     * The generic start steps that most upload queries will do
     *
     * @param query
     * @param type - the provider type
     * @returns {Promise}
     */
    async handle(query, type) {
        // global helpers
        let userInfo, resolveResults;

        try {
            // get information about this query user
            resolveResults = await this.getUserInfo(query, type);

            // store userInfo
            userInfo = resolveResults.userInfo;

            // check the cache
            resolveResults = await this.checkCache(resolveResults);

            // show status update
            resolveResults = await new Promise((resolve, rejectEdit) => {
                // set initial message status
                this.editMessage("\u{1F50E} Checking queue status... 1/4", {
                    chat_id: resolveResults.msgInfo.chat_id,
                    message_id: resolveResults.msgInfo.message_id
                })
                    .then(resultMessage => {
                        // store message
                        resolveResults.resultMessage = resultMessage;
                        // resolve results
                        resolve(resolveResults);
                    })
                    .catch(rejectEdit);
            });

            // enqueue the upload attempt
            resolveResults = await new Promise((resolve, failed) => {
                // enqueue this attempt
                this._app._Queue
                    .enqueue("upload")
                    .then(finished => {
                        // save queueKey
                        resolveResults.queueKey = finished.key;

                        // resolve the resolveResults, queue item is ready to go
                        resolve(resolveResults);
                    })
                    .catch(failed);
            });

            // show initial status
            resolveResults = await new Promise((resolve, rejectEdit) => {
                // set initial message status
                this.editMessage("\u{1F50E} Downloading file... 2/4", {
                    chat_id: resolveResults.msgInfo.chat_id,
                    message_id: resolveResults.msgInfo.message_id
                })
                    .then(resultMessage => {
                        // store message
                        resolveResults.resultMessage = resultMessage;
                        // resolve results
                        resolve(resolveResults);
                    })
                    .catch(rejectEdit);
            });
            // download file from telegram
            resolveResults = await this.downloadTelegram(resolveResults);

            // update status
            resolveResults = await new Promise((resolveEdit, rejectEdit) => {
                // begin uploading to dropbox drive
                this.editMessage("\u{1F4BE} Uploading... 3/4", {
                    chat_id: resolveResults.msgInfo.chat_id,
                    message_id: resolveResults.msgInfo.message_id
                })
                    .then(resultMessage => {
                        // store message
                        resolveResults.resultMessage = resultMessage;

                        // everything is okay, resolve the info
                        resolveEdit(resolveResults);
                    })
                    .catch(rejectEdit);
            });
        } catch (ex) {
            Logger.error(ex);

            // display error message if we have msgInfo object
            if (resolveResults.msgInfo) {
                // display the error message
                this.editMessageError({
                    chat_id: resolveResults.msgInfo.chat_id,
                    message_id: resolveResults.msgInfo.message_id
                })
                    .then(_ => {})
                    .catch(_ => {});
            }
            return Promise.reject(ex);
        }

        return resolveResults;
    }

    /**
     * Get user info for a given query
     *
     * @param query
     * @param type
     * @returns {Promise}
     */
    getUserInfo(query, type) {
        return new Promise((resolve, reject) => {
            // first get user info
            this._app._UserHelper
                .getUser(query.from.id)
                .then(userInfo => {
                    if (!userInfo) {
                        return resolve(
                            "It looks like you're not registered in our system."
                        );
                    }

                    if (!userInfo.provider_sites[type]) {
                        return resolve(
                            "This service not connected to your account"
                        );
                    }

                    // store key to fetch info about file
                    const storeKey =
                        "upload_" +
                        query.message.chat.id +
                        "-" +
                        query.message.message_id;

                    resolve({
                        userInfo: userInfo,
                        storeKey: storeKey,
                        query: query
                    });
                })
                .catch(reject);
        });
    }

    /**
     * Check the cache if we have info for the storeKey
     *
     * @param storeKey
     * @returns {Promise}
     */
    checkCache(resolveResults) {
        return new Promise((resolve, reject) => {
            // fetch from cache
            this._app._Cache.get(resolveResults.storeKey, (error, msgInfo) => {
                if (error) {
                    return reject(error);
                }
                if (!msgInfo) {
                    return reject(
                        "We couldn't find a file connected to this message. " +
                            "Try forwarding the file to UploadBro again so he can detect it more easily.",
                        true
                    );
                }
                // resolve the retrieved message info
                resolveResults.msgInfo = msgInfo;

                resolve(resolveResults);
            });
        });
    }

    /**
     * Download file from telegram
     *
     * @param msgInfo
     * @returns {Promise}
     */
    downloadTelegram(resolveResults) {
        return new Promise((resolve, reject) => {
            // download the file from telegram
            this.downloadFile(
                resolveResults.msgInfo.file_id,
                resolveResults.msgInfo.chat_id,
                resolveResults.msgInfo.file_name
            )
                // resolve new file location
                .then(file_location => {
                    // store file location
                    resolveResults.file_location = file_location;
                    // resolve the new location
                    resolve(resolveResults);
                })
                .catch(err => {
                    // download failed
                    reject(err);

                    // error result message
                    this.editMessageError({
                        chat_id: resolveResults.msgInfo.chat_id,
                        message_id: resolveResults.msgInfo.message_id
                    });
                });
        });
    }

    /**
     * get file contents after telegram download
     *
     * @param msgInfo
     * @param file_location
     * @returns {Promise}
     */
    getContents(msgInfo, file_location) {
        return new Promise((resolve, reject) => {
            // get file contents
            fs.readFile(file_location, (err, file_contents) => {
                if (err || !file_contents) {
                    // error result message
                    reject(err);
                    this.editMessageError({
                        chat_id: msgInfo.chat_id,
                        message_id: msgInfo.message_id
                    });
                    return;
                }

                // resolve the file contents and file location
                resolve({
                    file_contents: file_contents,
                    file_location: file_location
                });
            });
        });
    }

    /**
     * Remove the file after upload
     *
     * @param file_location
     * @returns {Promise}
     */
    removeOldFile(file_location) {
        return new Promise((resolve, reject) => {
            // attempt to remove file
            fs.unlink(file_location, err => {
                // not important if it fails
            });

            resolve();
        });
    }
};
