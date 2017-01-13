module.exports = class SiteHandler {
    constructor(app) {
        this._app = app;

        this._sites = {};
    }

    /**
     * Register a new website
     *
     * @param command
     * @param obj - a valid class object
     */
    register(site_name, obj) {
        // store the command
        this._sites[site_name] = {
            object: new obj(this._app),
            site_name: site_name,
        }

        this._sites[site_name]['object'].register();
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