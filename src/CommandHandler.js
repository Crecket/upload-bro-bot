module.exports = class CommandHandler {
    constructor(db, bot) {
        this._db = db;
        this._bot = bot;

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
            object: new obj(this._db, this._bot),
            pattern: pattern
        }

        // set the event listener
        this._bot.onText(pattern, this._commands[command].object.handle.bind(this))
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