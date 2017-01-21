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

        console.log(this);

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
                        .then(console.log)
                        .catch(err => console.log(err));
                })
        } else {
            this.answerCallbackQuery(query.id, "We couldn't find this command.")
                .then(console.log)
                .catch(err => console.log(err));
        }
    }

    /**
     * A message with a file event
     *
     * @param msg
     */
    messageFileLIstener(msg) {
        var file = false;

        // get file info
        if (msg.photo) {
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
        } else if (msg.document) {
            file = msg.document;
            file.file_type = "document";
        } else if (msg.video) {
            file = msg.video;
            if (!file.file_name) {
                file.file_name = msg.voice.file_id + ".mp4";
            }
            file.file_type = "video";
        } else if (msg.audio) {
            file = msg.audio;
            if (!file.file_name) {
                file.file_name = msg.audio.file_id + "." + mime.extension(file.mime_type);
            }
            file.file_type = "audio";
        } else if (msg.voice) {
            file = msg.audio;
            if (!file.file_name) {
                file.file_name = msg.voice.file_id + "." + mime.extension(file.mime_type);
            }
            file.file_type = "voice";
        } else {
            // invalid file type
            return;
        }

        var maxFileSize = 52428800;
        if (file.file_size > maxFileSize) {
            // bigger then 50 mb message
            var message = "The file is to big (" + filesize(file.file_size) + "), " +
                "we currently support up to " + filesize(52428800);

            // send the message
            this._TelegramBot.sendMessage(msg.chat.id, message, {
                parse_mode: "HTML",
                disable_notification: true
            }).then((resulting_message) => {
            }).catch(console.error);
            return;
        }

        // get the user info
        this._UserHelper.getUser(msg.from.id)
            .then((user_info) => {
                if (user_info) {

                    // user is registered, generate the download buttons
                    var buttonSiteList = [];

                    // loop through existing provider sites
                    Object.keys(user_info.provider_sites).map((key) => {

                        // check if this site is active right now
                        if (this._SiteHandler.isActive(key)) {
                            // push item into the button list
                            buttonSiteList.push({
                                text: key.toUpperCase(),
                                callback_data: "upload_" + key
                            });
                        }
                    })

                    if (buttonSiteList.length > 0) {
                        // send the keyboard
                        this._TelegramBot.sendMessage(msg.from.id,
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
                                this._Cache.set(storeKey, {
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
                        var message = "Your account is registered in our system but you havn't connected " +
                            "any services yet! You can use the <a href='/login'>/login</a> command to find out how.";
                        this._TelegramBot.sendMessage(msg.chat.id, message, {
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
        return;
        console.log("inline_query");
        console.log(inline_query);
        this._TelegramBot.answerInlineQuery(inline_query.id, [
            {
                title: "title1",
                caption: "caption1",
                description: "description1",
                type: "photo",
                id: "blackjack_bot_test_id1",
                photo_url: "https://www.masterypoints.com/assets/cards/2_of_hearts.png",
                thumb_url: "https://www.masterypoints.com/assets/cards/2_of_hearts.png",
            },
            {
                title: "title2",
                caption: "caption2",
                description: "description2",
                type: "photo",
                id: "blackjack_bot_test_id2",
                photo_url: "https://www.masterypoints.com/assets/cards/3_of_hearts.png",
                thumb_url: "https://www.masterypoints.com/assets/cards/3_of_hearts.png",
            },
            {
                title: "title3",
                caption: "caption3",
                description: "description3",
                type: "photo",
                id: "blackjack_bot_test_id3",
                photo_url: "https://www.masterypoints.com/assets/cards/3_of_hearts.png",
                thumb_url: "https://www.masterypoints.com/assets/cards/3_of_hearts.png",
            },
            {
                title: "title4",
                caption: "caption4",
                description: "description4",
                type: "photo",
                id: "blackjack_bot_test_id4",
                photo_url: "https://www.masterypoints.com/assets/cards/3_of_hearts.png",
                thumb_url: "https://www.masterypoints.com/assets/cards/3_of_hearts.png",
            },
            {
                type: "article",
                id: "blackjack_bot_article_id",
                title: "Hit",
                input_message_content: {
                    message_text: "Hit",
                    // parse_mode: "",
                    disable_web_page_preview: true
                },
            }
        ])
    }

}