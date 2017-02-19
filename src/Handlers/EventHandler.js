var Logger = require('./../Logger');
var mime = require('mime');
var path = require('path');
var requireFix = require('app-root-path').require;
var HelperInterface = requireFix('src/HelperInterface');
var filesize = require('filesize');

module.exports = class EventHandlers extends HelperInterface {
    constructor(app) {
        super(app);
        this._app = app;

        this._logger = Logger;
    }

    /**
     * Callback query event
     *
     * @param query
     */
    callbackQuery(query) {
        var queryList = this._QueryHandler.queries;
        var splitData = query.data.split('|');

        // first part is the selected query type
        var selectedQuery = queryList[splitData[0]];

        // check if the selected query was found
        if (selectedQuery) {
            // start the handle request with this query
            selectedQuery.handle(query)
                .then((message = "") => {
                    return this.answerCallbackQuery(query.id, message)
                        .then((res) => {
                            // console.log(res);
                        })
                        .catch(err => console.log(err));
                })
                .catch((error) => {
                    console.log(error);
                    return this.answerCallbackQuery(query.id)
                        .then((res) => {
                            // console.log(res);
                        })
                        .catch(err => console.log(err));
                })
        } else {
            this.answerCallbackQuery(query.id, "We couldn't find this command.")
                .then((res) => {
                    // console.log(res);
                })
                .catch(err => console.log(err));
        }
    }

    /**
     * A message with a file event
     *
     * @param msg
     */
    messageFileListener(msg, type) {
        var file = false;

        // get file info
        if (type === "photo") {
            // get the highest quality picture
            file = msg.photo[msg.photo.length - 1];
            if (!file.file_name) {
                var ext = ".jpg";
                if (file.mime_type) {
                    ext = "." + mime.extension(file.mime_type)
                }
                file.file_name = file.file_id + ext;
            }
            file.file_type = "photo";

        } else if (type === "document") {
            file = msg.document;
            file.file_type = "document";

        } else if (type === "video") {
            file = msg.video;
            if (!file.file_name) {
                file.file_name = msg.voice.file_id + ".mp4";
            }
            file.file_type = "video";

        } else if (type === "audio") {
            file = msg.audio;
            if (!file.file_name) {
                file.file_name = msg.audio.file_id + "." + mime.extension(file.mime_type);
            }
            file.file_type = "audio";

        } else if (type === "voice") {
            file = msg.audio;
            if (!file.file_name) {
                file.file_name = msg.voice.file_id + "." + mime.extension(file.mime_type);
            }
            file.file_type = "voice";

        } else {
            // invalid file type
            console.log(file);
            return;
        }

        const maxFileSize = 52428800;
        if (file.file_size > maxFileSize) {
            // bigger then 50 mb message
            var message = "The file is to big (" + filesize(file.file_size) + "), " +
                "we currently support up to " + filesize(maxFileSize);

            // send the message
            this._app._TelegramBot.sendMessage(msg.chat.id, message, {
                parse_mode: "HTML",
                disable_notification: true
            }).then((resulting_message) => {
            }).catch(console.error);
            return;
        }

        // get the user info
        this._app._UserHelper.getUser(msg.from.id)
            .then((user_info) => {
                if (user_info) {

                    // user is registered, generate the download buttons
                    var buttonSiteList = this.generateProviderButtons(user_info);

                    if (buttonSiteList.length > 0) {
                        // send the keyboard
                        this._app._TelegramBot.sendMessage(msg.from.id,
                            "Do you want to upload this file?", {
                                reply_markup: {
                                    inline_keyboard: [
                                        buttonSiteList,
                                        [{
                                            text: "Refresh sites",
                                            callback_data: "refresh_provider_buttons"
                                        }]
                                    ]
                                }
                            })
                            .then((resulting_message) => {
                                // setup the key to store the file
                                var storeKey = "upload_" + resulting_message.chat.id +
                                    "-" + resulting_message.message_id;
                                // store the file
                                this._app._Cache.set(storeKey, {
                                        chat_id: resulting_message.chat.id,
                                        message_id: resulting_message.message_id,
                                        file_name: file.file_name,
                                        file_size: file.file_size,
                                        file_id: file.file_id
                                    }, 60 * 60 * 24 * 30, // store for 1 month
                                    (err, result_cache) => {

                                    })
                            })
                            .catch(console.error);
                    } else {
                        var message = "Your account is registered in our system but you haven't connected " +
                            "any services yet! You can use the <a href='/login'>/login</a> command to find out how.";
                        this._app._TelegramBot.sendMessage(msg.chat.id, message, {
                            parse_mode: "HTML",
                            disable_notification: true
                        }).then((resulting_message) => {

                        }).catch(console.error);
                    }

                } else {
                    // nothing to do, this user isn't registered
                }
            }).catch(console.error);

    }

    /**
     * A inline query event
     *
     * @param inline_query
     */
    inlineQuery(inline_query) {

        // get the query
        var queryData = inline_query.query;
        var inlineQueries = this._InlineQueryHandler.inlineQueries;
        var foundQuery = false;

        Object.keys(inlineQueries).map((key) => {
            var queryTemp = inlineQueries[key];
            if (foundQuery) {
                // nothing to do, already matched one
                return;
            }

            // get the regex matches
            var matches = queryData.match(queryTemp.match);

            if (matches) {
                // query matches this inline query
                queryTemp.handle(inline_query, matches[1])
                    .then((inline_results = [], options = {
                        cache_time: 300,
                        is_personal: true
                    }) => {
                        // enforce this option
                        options.is_personal = true;

                        // return the query
                        this._TelegramBot.answerInlineQuery(inline_query.id,
                            inline_results,
                            options
                        ).then((result) => {
                            // success
                        }).catch(err => console.log(err));
                    })
                    .catch(err => console.log(err));
            }
        });
    }

}
