module.exports = class SiteInteface {
    constructor(app) {
        this._app = app;
    }

    handle() {
        throw Error("Handle function is not implemented");
    }

    sendMessage(chatId, message, options) {
        return this._app._TelegramBot.sendMessage(chatId, message, options);
    }
}
