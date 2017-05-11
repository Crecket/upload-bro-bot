const fs = require("fs");
const path = require("path");
const Logger = require("../Helpers/Logger");
const HelperInterface = require("../HelperInterface");

module.exports = class Help extends HelperInterface {
    constructor(UploadBro) {
        super(UploadBro);
        this._UploadBro = UploadBro;
    }

    handle(msg) {
        const commands = this._UploadBro._CommandHandler.commands;
        const commandList = Object.keys(commands)
            .map(commandKey => {
                const tempCommand = commands[commandKey];
                return ` - <a href="/${tempCommand.name}">/${tempCommand.name}</a>: ${tempCommand.description}`;
            })
            .join("\n");

        const message = `<b>Available commands</b>\n` + `${commandList}`;

        super
            .sendMessage(msg.chat.id, message, {
                parse_mode: "HTML"
            })
            .then(res => {})
            .catch(Logger.error);
    }

    /**
     * The name for this command
     * @returns {string}
     */
    get name() {
        return "help";
    }

    /**
     * The description for this command
     * @returns {string}
     */
    get description() {
        return `Information about the bot and it's options`;
    }

    /**
     * Returns a string with the <command> - <description>
     * @returns {string}
     */
    get info() {
        return `${this.name} - ${this.description}`;
    }

    /**
     * Pattern used for this command
     * @returns {RegExp}
     */
    get pattern() {
        return /\/help$/;
    }
};
