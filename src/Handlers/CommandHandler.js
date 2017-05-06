module.exports = class CommandHandler {
    constructor(UploadBro) {
        this._UploadBro = UploadBro;

        this._commands = {};
    }

    /**
     * Register a new command
     *
     * @param obj - a valid class object
     */
    register(obj) {
        // store the command
        this._commands[obj.name] = obj;

        // set the event listener
        this._UploadBro._TelegramBot.onText(obj.pattern, obj.handle.bind(this));
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

    /**
     * Returns a list of all the info items for each command,
     * can be used to create the command list for bot father settings
     * @returns {string}
     */
    get info() {
        var info = "";
        Object.keys(this._commands).map(key => {
            info += this._commands[key].info + "\n";
        });
        return info;
    }
};
