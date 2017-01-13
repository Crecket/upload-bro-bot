module.exports = class CommandHandler {
    constructor(app) {
        this._app = app;

        this._commands = {};
    }

    /**
     * Register a new command
     *
     * @param command
     * @param obj - a valid class object
     */
    register(command, pattern, obj) {
        // store the command
        this._commands[command] = {
            object: new obj(this._app),
            pattern: pattern
        }

        // set the event listener
        this._app._TelegramBot.onText(pattern, this._commands[command].object.handle.bind(this))
    }

    /**
     * Return app
     * @returns {*}
     */
    get app() {
        return this._app;
    }

    /**
     * @returns {{}|*}
     */
    get commands() {
        return this._commands;
    }

    /**
     * @returns int
     */
    get commandCount() {
        return Object.keys(this._commands).length;
    }
}