module.exports = class SiteHandler {
    constructor(db, bot, commandHandler) {
        this._db = db;
        this._bot = bot;
        this._commandHandler = commandHandler;

        this._sites = {};
    }

    /**
     * Register a new website
     *
     * @param command
     * @param obj - a valid class object
     */
    register(site_name, prefix, obj) {
        // store the command
        this._sites[site_name] = {
            object: new obj(this._db, this._bot, this._commandHandler),
            prefix: prefix
        }

        this._sites[site_name]['object'].register();
    }

    /**
     * Return db
     * @returns {*}
     */
    get db() {
        return this._db;
    }

    /**
     * Return the bot
     * @returns {*}
     */
    get bot() {
        return this._bot;
    }

    /**
     * @returns {{}|*}
     */
    get sites() {
        return this._sites;
    }

    /**
     * @returns int
     */
    get siteCount() {
        return Object.keys(this._sites).length;
    }
}