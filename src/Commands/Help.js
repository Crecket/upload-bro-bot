const fs = require('fs');
const path = require('path');
const winston = rootRequire('src/Helpers/Logger.js');

const HelperInterface = require(path.join(__dirname, '/../HelperInterface'));

module.exports = class Help extends HelperInterface {
    constructor(app) {
        super(app);

        this._app = app;
    }

    handle(msg) {
        const message = "<b>Available commands</b>\n" +
            "- <a href='/help'>/help</a>: Display this command \n" +
            "- <a href='/start'>/start</a>: The start message \n" +
            "- <a href='/login'>/login</a>: Show the login url to connect the supported websites to your telegram account" +
            "";

        super.sendMessage(msg.chat.id, message, {
            parse_mode: "HTML"
        }).then(res => {
        }).catch(winston.error);
    }

    /**
     * The name for this command
     * @returns {string}
     */
    get name() {
        return "help";
    }

    /**
     * Returns a string with the <command> - <description>
     * @returns {string}
     */
    get info() {
        return "help - Helpful information about the bot and it's options";
    }

    /**
     * Pattern used for this command
     * @returns {RegExp}
     */
    get pattern() {
        return /\/help/;
    }
}

