var Logger = require('../Logger');

module.exports = class ProviderInterface {
    constructor(db, bot) {
        this._db = db;
        this._bot = bot;

        this._logger = Logger;
    }

    handle() {
        throw Error("Handle function is not implemented");
    }

    sendMessage(chatId, message, options) {
        this._bot.sendMessage(chatId, message, options);
    }
}