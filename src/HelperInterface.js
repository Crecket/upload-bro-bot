var fs = require("fs");
var path = require("path");
var Utils = require("./Helpers/Utils");
var Logger = require("./Helpers/Logger");

module.exports = class HelperInterface {
    constructor(UploadBro) {
        this._UploadBro = UploadBro;
    }

    /**
     * send function using telegram bot
     *
     * @param chatId
     * @param message
     * @param options
     * @returns {*}
     */
    sendMessage(chatId, message, options) {
        return this._UploadBro._TelegramBot.sendMessage(
            chatId,
            message,
            options
        );
    }

    /**
     * Download a file with telegram bot
     *
     * @param file_id
     * @param chat_id
     * @param file_name
     * @returns {Promise}
     */
    downloadFile(file_id, chat_id, file_name = false) {
        return new Promise((resolve, reject) => {
            // target installation directory
            var directory = path.resolve(`${__dirname}/../downloads`);

            // assert the lower folder exists
            Utils.ensureFolderExists(directory, "0744")
                .then(() => {
                    // download the file
                    this._UploadBro._TelegramBot
                        .downloadFile(file_id, directory)
                        .then(finalPath => {
                            if (!file_name) {
                                return resolve(finalPath);
                            }
                            // set the target path
                            var targetName = path.resolve(
                                `${__dirname}/../downloads/${file_name}`
                            );
                            // rename the file
                            fs.rename(finalPath, targetName, err => {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve(targetName);
                                }
                            });
                        });
                })
                .catch(err => {
                    reject(err);
                });
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
        return this._UploadBro._TelegramBot.editMessageText(text, options);
    }

    /**
     * Edit a message that something went wrong. Attempt and throw-away
     * @param options
     */
    editMessageError(options) {
        // check if a custom error was given
        if (options.error && options.error.custom_error) {
            // check which custom error
            switch (options.error.custom_error) {
                case "remove_account": {
                    // check for user info since it isn't implemented properly everywhere
                    if (options.user_info) {
                        // remove this provider type from the account, the refresh token/access tokens are no longer valid
                        this._UploadBro._UserHelper
                            .removeUserTokens(
                                options.user_info,
                                options.error.custom_error_options.site
                            )
                            .then(_ => {
                                // we removed the user's info for the site
                                this.editMessage(
                                    `\u{2639} It looks like the tokens we had for your account have expired! Please go ` +
                                        `to the website to log back in. (<a href='/login'>/login</a>)`,
                                    {
                                        chat_id: options.chat_id,
                                        message_id: options.message_id,
                                        parse_mode: "HTML"
                                    }
                                )
                                    .then(res => {
                                        Logger.trace(res);
                                    })
                                    .catch(err => {
                                        Logger.trace(err);
                                    });
                            })
                            .catch(Logger.error);
                    }
                    return;
                }
            }
        }
        this.editMessage("\u{26A0} It looks like something went wrong!", {
            chat_id: options.chat_id,
            message_id: options.message_id
        })
            .then(() => {})
            .catch(() => {});
    }

    /**
     * generate a button list for inline keyboards
     * @param user
     */
    generateProviderButtons(user, extension) {
        var buttonSiteList = [];

        // loop through existing provider sites
        Object.keys(user.provider_sites).map(key => {
            // check if this site is active right now
            if (this._UploadBro._SiteHandler.isActive(key)) {
                var siteInfo = this._UploadBro._SiteHandler.getSiteBasic(key);

                // check if site is enabled and supports this file type
                if (
                    !siteInfo ||
                    !this.verifyExtensions(
                        siteInfo.supportedExtensions,
                        extension
                    )
                ) {
                    // invalid extension
                    return buttonSiteList;
                }

                // push item into the button list
                buttonSiteList.push({
                    text: siteInfo.title,
                    callback_data: "upload_" + key
                });
            }
        });

        return buttonSiteList;
    }

    /**
     * checks if ext-type is listed in the allowed array
     *
     * @param allowed
     * @param type
     * @returns {boolean}
     */
    verifyExtensions(allowed, ext) {
        if (allowed === true) {
            // wildcard enabled
            return true;
        }

        // check allowed list
        return allowed.some(extension => {
            return "." + extension === ext.toLowerCase();
        });
    }
};
