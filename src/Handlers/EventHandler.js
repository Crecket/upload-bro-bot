const mime = require("mime");
const path = require("path");
const filesize = require("filesize");
const Logger = require("..//Helpers/Logger.js");
const HelperInterface = require("../HelperInterface");

module.exports = class EventHandlers extends HelperInterface {
    constructor(app) {
        super(app);
        this._app = app;
    }

    /**
     * Callback query event
     *
     * @param query
     */
    callbackQuery(query) {
        var queryList = this._app._QueryHandler.queries;
        var splitData = query.data.split("|");

        // first part is the selected query type
        var selectedQuery = queryList[splitData[0]];

        // check if the selected query was found
        if (selectedQuery) {
            // start the handle request with this query
            selectedQuery
                .handle(query)
                .then((message = "") => {
                    // answer the query with the results
                    return this._app
                        .answerCallbackQuery(query.id, message)
                        .then(res => {
                            // Logger.trace(res);
                        })
                        .catch(err => Logger.error(err));
                })
                .catch(error => {
                    Logger.error(error);

                    // answer the query with the error
                    return this._app
                        .answerCallbackQuery(
                            query.id,
                            "It looks like something went wrong."
                        )
                        .then(res => {
                            // Logger.trace(res);
                        })
                        .catch(err => Logger.error(err));
                });
        } else {
            // answer the query taht we couldn't find the command
            this._app
                .answerCallbackQuery(query.id, "We couldn't find this command.")
                .then(res => {
                    // Logger.trace(res);
                })
                .catch(err => Logger.error(err));
        }
    }

    /**
     * A message with a file event
     *
     * @param msg
     */
    messageFileListener(msg, type) {
        var file = false;

        // track the file request
        this._app._Analytics.trackFile(msg, type);

        // get file info
        if (type === "photo") {
            // get the highest quality picture
            file = msg.photo[msg.photo.length - 1];
            if (!file.file_name) {
                var ext = ".jpg";
                if (file.mime_type) {
                    ext = "." + mime.extension(file.mime_type);
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
                file.file_name =
                    msg.audio.file_id + "." + mime.extension(file.mime_type);
            }
            file.file_type = "audio";
        } else if (type === "voice") {
            file = msg.audio;
            if (!file.file_name) {
                file.file_name =
                    msg.voice.file_id + "." + mime.extension(file.mime_type);
            }
            file.file_type = "voice";
        } else {
            // invalid file type
            Logger.trace(file);
            return;
        }
        // get the file extension
        const fileExtension = path.extname(file.file_name);

        const maxFileSize = 52428800;
        if (file.file_size > maxFileSize) {
            // bigger then 50 mb message
            var message =
                "The file is to big (" +
                filesize(file.file_size) +
                "), " +
                "we currently support up to " +
                filesize(maxFileSize);

            // send the message
            this._app._TelegramBot
                .sendMessage(msg.chat.id, message, {
                    parse_mode: "HTML",
                    disable_notification: true
                })
                .then(resulting_message => {})
                .catch(Logger.error);
            return;
        }

        // get the user info
        this._app._UserHelper
            .getUser(msg.from.id)
            .then(user_info => {
                if (user_info) {
                    // user is registered, generate the download buttons
                    var buttonSiteList = this.generateProviderButtons(
                        user_info,
                        fileExtension
                    );

                    // check if we have atleast 1 connected server
                    if (buttonSiteList.length > 0) {
                        // send the keyboard
                        this._app._TelegramBot
                            .sendMessage(
                                msg.from.id,
                                "Do you want to upload this file? \n" +
                                    "Filename: " +
                                    file.file_name +
                                    " \n" +
                                    "Filesize: " +
                                    filesize(file.file_size),
                                {
                                    reply_markup: {
                                        inline_keyboard: [
                                            buttonSiteList

                                            // TODO the refresh query has to check for valid extensions

                                            // [{

                                            //     text: "Refresh sites",

                                            //     callback_data: "refresh_provider_buttons"

                                            // }]
                                        ]
                                    }
                                }
                            )
                            .then(resulting_message => {
                                // setup the key to store the file
                                let storeKey =
                                    "upload_" +
                                    resulting_message.chat.id +
                                    "-" +
                                    resulting_message.message_id;

                                // store the file
                                this._app._Cache.set(
                                    storeKey,
                                    {
                                        chat_id: resulting_message.chat.id,
                                        message_id:
                                            resulting_message.message_id,
                                        file_name: file.file_name,
                                        file_size: file.file_size,
                                        file_id: file.file_id
                                    },
                                    60 * 60 * 24 * 30, // store for 1 month
                                    (err, result_cache) => {
                                        if (err) Logger.error(err);
                                    }
                                );
                            })
                            .catch(Logger.error);
                    } else {
                        // warn the user that we don't have any providers for them yet
                        var message =
                            "Your account is registered in our system but you haven't connected " +
                            "any services yet! You can use the <a href='/login'>/login</a> command to find out how.";
                        this._app._TelegramBot
                            .sendMessage(msg.chat.id, message, {
                                parse_mode: "HTML",
                                disable_notification: true
                            })
                            .then(resulting_message => {
                                // don't care
                            })
                            .catch(Logger.error);
                    }
                } else {
                    // nothing to do, this user isn't registered
                }
            })
            .catch(Logger.error);
    }

    /**
     * A inline query event
     *
     * @param inline_query
     */
    inlineQuery(inline_query) {
        // get the query
        const queryData = inline_query.query;
        const inlineQueries = this._app._InlineQueryHandler.inlineQueries;
        const foundQuery = false;

        Object.keys(inlineQueries).map(key => {
            const queryTemp = inlineQueries[key];
            if (foundQuery) {
                // nothing to do, already matched one
                return;
            }

            // get the regex matches
            const matches = queryData.match(queryTemp.match);
            if (matches) {
                // query matches this inline query
                queryTemp
                    .handle(inline_query, matches[1])
                    .then(results => {
                        let {
                            inline_results = [],
                            options = {
                                cache_time: 300,
                                is_personal: true
                            }
                        } = results;

                        // enforce this option
                        options.is_personal = true;

                        // return the query
                        this._app._TelegramBot
                            .answerInlineQuery(
                                inline_query.id,
                                inline_results,
                                options
                            )
                            .then(result => {
                                // success
                            })
                            .catch(Logger.error);
                    })
                    .catch(Logger.error);
            }
        });
    }
};
