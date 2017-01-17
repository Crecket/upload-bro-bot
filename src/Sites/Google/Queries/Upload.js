var fs = require('fs');
var path = require('path');
var appRoot = require('app-root-path');
var requireFix = appRoot.require;

var HelperInterface = requireFix('/src/HelperInterface');
var Utils = requireFix('/src/Utils');

var GoogleHelperObj = requireFix('/src/Sites/Google/GoogleHelper');

module.exports = class Upload extends HelperInterface {
    constructor(app) {
        super(app);

        this._app = app;

        // create google helper
        this._GoogleHelper = new GoogleHelperObj(app);
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
            // first get user info
            this._app._UserHelper.getUser(query.from.id).then((user_info) => {
                if (!user_info) {
                    return reject("User not found");
                }

                if (!user_info.provider_sites.google) {
                    return reject("Google service not provided");
                }

                // store key to fetch info about file
                var storeKey = "upload_" + query.message.chat.id +
                    "-" + query.message.message_id;

                // fetch from cache
                this._app._Cache.get(storeKey, (error, result) => {
                    if (error) {
                        return reject(error);
                    }
                    var chat_id = result.chat_id;
                    var message_id = result.message_id;
                    var file_id = result.file_id;
                    var file_name = result.file_name;

                    // \u{2705} finished icon

                    this.editMessage("\u{1F50E} Fetching file... 1/3", {
                        chat_id: chat_id,
                        message_id: message_id
                    }).then((result_message) => {
                        this.downloadFile(file_id, chat_id, file_name)
                            .then((file_location) => {
                                // begin uploading to google drive
                                this.editMessage("\u{231B} Uploading to Google Drive... 2/3", {
                                    chat_id: chat_id,
                                    message_id: message_id
                                })
                                    .then((result_message) => {

                                        this._GoogleHelper
                                            .uploadFile(user_info.provider_sites.google,
                                                file_location,
                                                "card_v2.jpg"
                                            );

                                    }).catch(reject);
                            }).catch(reject);
                    }).catch(reject);
                })
            }).catch(reject)
        });
    }

    /**
     * Edit a message
     *
     * @param text
     * @param options
     * @returns {*}
     */
    editMessage(text, options) {
        return this._app._TelegramBot.editMessageText(text, options);
    }

    /**
     * Get event name for this query
     * @returns {string}
     */
    get event() {
        return "upload_google";
    }
}

