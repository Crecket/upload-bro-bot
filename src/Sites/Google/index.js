var SiteInteface = require('./SiteInteface');

module.exports = class Google extends SiteInteface {
    constructor(db, bot, commandHandler) {
        super();

        this._db = db;
        this._bot = bot;
        this._commandHandler = commandHandler;
    }

    /**
     * Load all commands for this website
     */
    register() {
        // this._commandHandler.register('login', /\/login/, require(__dirname + '/Commands/Login'));

        return Promise.resolve();
    }
}

