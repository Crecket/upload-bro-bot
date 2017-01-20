module.exports = class SiteHandler {
    constructor(app) {
        this._app = app;

        this._sites = {};
    }

    /**
     * Register a new website
     *
     * @param obj - a valid site object
     */
    register(obj) {
        // store the command
        this._sites[obj.name] = obj;

        // call register event
        obj.register();
    }

    /**
     * Check if a site is registered and active
     *
     * @param name
     * @returns {boolean}
     */
    isActive(name) {
        return !!this._sites[name];
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