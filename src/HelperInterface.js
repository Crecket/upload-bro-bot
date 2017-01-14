var Logger = require('./Logger');

module.exports = class HelperInterface {
    constructor(app) {
        this._app = app;

        this._logger = Logger;
    }

    sendMessage(chatId, message, options) {
        this._app._TelegramBot.sendMessage(chatId, message, options);
    }
}