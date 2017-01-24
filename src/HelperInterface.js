var fs = require('fs');
var path = require('path');
var appRoot = require('app-root-path');
var requireFix = appRoot.require;

var Logger = require('./Logger');
var Utils = require('./Utils');

module.exports = class HelperInterface {
    constructor(app) {
        this._app = app;

        this._logger = Logger;
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
        return this._app._TelegramBot.sendMessage(chatId, message, options);
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
            var directory = appRoot + "/downloads";

            // assert the lower folder exists
            Utils.ensureFolderExists(directory, '0744').then(() => {
                // download the file
                this._app._TelegramBot.downloadFile(
                    file_id,
                    directory
                ).then((finalPath) => {
                    if (!file_name) {
                        return resolve(finalPath);
                    }
                    // set the target path
                    var targetName = appRoot + "/downloads/" + file_name;
                    // rename the file
                    fs.rename(finalPath, targetName, (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(targetName);
                        }
                    });
                })
            }).catch((err) => {
                reject(err);
            });
        })
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
     * generate a button list for inline keyboards
     * @param user
     */
    generateProviderButtons(user) {
        var buttonSiteList = [];

        // loop through existing provider sites
        Object.keys(user.provider_sites).map((key) => {

            // check if this site is active right now
            if (this._app._SiteHandler.isActive(key)) {
                var siteInfo = this._app._SiteHandler.getSite(key);

                // push item into the button list
                buttonSiteList.push({
                    text: siteInfo.title,
                    callback_data: "upload_" + key
                });
            }
        })

        return buttonSiteList;
    }

}