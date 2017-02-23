var fs = require('fs');
var path = require('path');
var appRoot = require('app-root-path');
var requireFix = appRoot.require;

var HelperInterface = requireFix('/src/HelperInterface');
var Utils = requireFix('/src/Utils');

var DropboxHelperObj = requireFix('/src/Sites/Dropbox/Helper');

module.exports = class Upload extends HelperInterface {
    constructor(app) {
        super(app);

        this._app = app;

        // create dropbox helper
        this._DropboxHelper = new DropboxHelperObj(app);
    }

    /**
     * Handle a download query request
     *
     * @param query
     * @returns {Promise}
     */
    handle(query) {
        // console.log(query);
        return new Promise((resolve, reject) => {
            // global helpers
            let msgInfo;
            let userInfo

            // get information about this query user
            this.getUser(query)
                .then(resolveResults => {
                    userInfo = resolveResults.userInfo;

                    // check the cache
                    return this.checkCache(resolveResults.storeKey)
                })
                // show initial status
                .then(messageInfoTemp => {
                    msgInfo = messageInfoTemp;

                    // show status
                    return new Promise((resolveEdit, rejectEdit) => {
                        // set initial message status
                        this.editMessage("\u{1F50E} Fetching file... 1/3", {
                            chat_id: msgInfo.chat_id,
                            message_id: msgInfo.message_id
                        })
                            .then(resolveEdit)
                            .catch(rejectEdit);
                    });
                })
                // download file from telegram
                .then(result_message => this.downloadTelegram(msgInfo))
                // update status
                .then(file_location => {
                    // show status
                    return new Promise((resolveEdit, rejectEdit) => {
                        // begin uploading to dropbox drive
                        this.editMessage("\u{231B} Uploading to Dropbox... 2/3", {
                            chat_id: msgInfo.chat_id,
                            message_id: msgInfo.message_id
                        })
                            .then(() => resolveEdit(file_location))
                            .catch(rejectEdit);
                    })
                })
                // get file contents
                .then(file_location => {
                    return this.getContents(msgInfo, file_location);
                })
                // upload to dropbox
                .then(resolveResults => {
                    return this.uploadDropbox(msgInfo, resolveResults.file_contents, resolveResults.file_location, userInfo);
                })
                // show status
                .then(resolveResults => {
                    // show status message
                    return new Promise((resolveEdit, rejectEdit) => {
                        // show finished message with the final URL
                        this.editMessage("\u{2705} Finished uploading!", {
                            chat_id: msgInfo.chat_id,
                            message_id: msgInfo.message_id
                        })
                            .then(() => resolveEdit(resolveResults.file_location))
                            .catch(rejectEdit);
                    });
                })
                .then(file_location => this.removeOldFile(file_location))
                .catch(reject);
        });
    }

    /**
     * Get user info for a given query
     *
     * @param query
     * @returns {Promise}
     */
    getUser(query) {
        return new Promise((resolve, reject) => {
            // first get user info
            this._app._UserHelper.getUser(query.from.id)
                .then((userInfo) => {
                    if (!userInfo) {
                        return resolve("It looks like you're not registered in our system.");
                    }

                    if (!userInfo.provider_sites.dropbox) {
                        return resolve("Dropbox service not connected to your account");
                    }

                    // store key to fetch info about file
                    const storeKey = "upload_" + query.message.chat.id +
                        "-" + query.message.message_id;

                    resolve({
                        userInfo: userInfo,
                        storeKey: storeKey
                    });
                })
                .catch(reject);
        })
    }

    /**
     * Check the cache if we have info for the storeKey
     *
     * @param storeKey
     * @returns {Promise}
     */
    checkCache(storeKey) {
        return new Promise((resolve, reject) => {
            // fetch from cache
            this._app._Cache.get(storeKey, (error, msgInfo) => {
                if (error) {
                    return reject(error);
                }
                if (!msgInfo) {
                    return reject("We couldn't find a file connected to this message. " +
                        "Try forwarding the file to UploadBro again so he can detect it more easily.", true);
                }
                // resolve the retrieved message info
                resolve(msgInfo);
            });
        })
    }

    /**
     * Download file from telegram
     *
     * @param msgInfo
     * @returns {Promise}
     */
    downloadTelegram(msgInfo) {
        return new Promise((resolve, reject) => {
            // download the file from telegram
            this.downloadFile(msgInfo.file_id, msgInfo.chat_id, msgInfo.file_name)
            // resolve new file location
                .then((file_location) => {
                    resolve(file_location);
                })
                .catch(err => {
                    // download failed
                    reject(err);

                    // error result message
                    this.editMessageError({
                        chat_id: msgInfo.chat_id,
                        message_id: msgInfo.message_id
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
                })
            });
        });
    }

    /**
     * Upload file to dropbox
     *
     * @param msgInfo
     * @param file_contents
     * @param file_location
     * @param userInfo
     * @returns {Promise}
     */
    uploadDropbox(msgInfo, file_contents, file_location, userInfo) {
        return new Promise((resolve, reject) => {
            // upload to dropbox
            this._DropboxHelper.uploadFile({
                    path: '/' + path.basename(file_location),
                    contents: file_contents
                },
                userInfo.provider_sites.dropbox
            )
            // resolve file location to removeOldFile
                .then((upload_result) => resolve({
                    upload_result: upload_result,
                    file_location: file_location
                }))
                .catch(err => {
                    // dropbox upload failed
                    reject(err);

                    // error result message
                    this.editMessageError({
                        chat_id: msgInfo.chat_id,
                        message_id: msgInfo.message_id
                    });
                });
        })
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
            fs.unlink(file_location, (err) => {
                // not important if it fails
            })

            resolve();
        })
    }

    /**
     * Get event name for this query
     * @returns {string}
     */
    get event() {
        return "upload_dropbox";
    }
}

