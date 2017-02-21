var Logger = require('../Logger');

module.exports = class SiteInteface {
    constructor(app) {
        this._app = app;

        this._logger = Logger;
    }

    handle() {
        throw Error("Handle function is not implemented");
    }

    sendMessage(chatId, message, options) {
        this._app._TelegramBot.sendMessage(chatId, message, options);
    }
}