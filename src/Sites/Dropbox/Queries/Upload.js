var fs = require('fs');
var path = require('path');

var HelperInterface = require(path.join(__dirname, '../HelperInterface'));

module.exports = class MySites extends HelperInterface {
    constructor(app) {
        super(app);

        this._app = app;
    }

    /**
     * Handle a query
     *
     * @param query
     * @returns {Promise}
     */
    handle(query) {
        // console.log(query);
        return new Promise((resolve, reject) => {
            // first get user info
            this._app._UserHelper.getUser(query.from.id).then((user_info) => {
                if (!user_info) {
                    return resolve("It looks like you're not registered in our system.");
                }

                if (!user_info.provider_sites.dropbox) {
                    return resolve("Dropbox service not connected to your account");
                }

                // store key to fetch info about file
                var storeKey = "upload_" + query.message.chat.id +
                    "-" + query.message.message_id;

                // fetch from cache
                this._app._Cache.get(storeKey, (error, result) => {
                    if (error) {
                        return reject(error);
                    }
                    if (!result) {
                        return resolve("We couldn't find a file connected to this message. " +
                            "Try forwarding the file to UploadBro again within.");
                    }
                    var chat_id = result.chat_id;
                    var message_id = result.message_id;
                    var file_id = result.file_id;
                    var file_name = result.file_name;

                    // set initial message status
                    this.editMessage("\u{1F50E} Fetching file... 1/3", {
                        chat_id: chat_id,
                        message_id: message_id
                    }).then((result_message) => {
                        // download the file from telegram
                        this.downloadFile(file_id, chat_id, file_name)
                            .then((file_location) => {
                                // begin uploading to dropbox drive
                                this.editMessage("\u{231B} Uploading to Google Drive... 2/3", {
                                    chat_id: chat_id,
                                    message_id: message_id
                                }).then((result_message) => {

                                    // upload to dropbox
                                    this._GoogleHelper.uploadFile(user_info.provider_sites.dropbox,
                                        file_location,
                                        path.basename(file_location)
                                    ).then((upload_res) => {
                                        // begin uploading to dropbox drive
                                        this.editMessage("\u{2705} Finished uploading!", {
                                            chat_id: chat_id,
                                            message_id: message_id
                                        }).then((result_message) => {
                                            // finished uploading
                                            resolve();

                                            // attempt to remove file
                                            fs.unlink(file_location, (err) => {
                                                if (err) {
                                                    return reject(err);
                                                }
                                            })
                                        }).catch(reject);
                                    }).catch(reject);
                                }).catch(reject);
                            }).catch(reject);
                    }).catch(reject);
                })
            }).catch(reject)
        });
    }

    /**
     * Get event name for this query
     * @returns {string}
     */
    get event() {
        return "upload_dropbox";
    }
}

