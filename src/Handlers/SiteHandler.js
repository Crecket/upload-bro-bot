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
        // store the command using lowercase name
        this._sites[obj.name.toLowerCase()] = obj;

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
        return !!this._sites[name] || !!this._sites[name.toLowerCase()];
    }

    /**
     * Return a site or false
     *
     * @param name
     * @returns {boolean}
     */
    getSite(name) {
        var site = this._sites[name.toLowerCase()];
        return site ? site : false;
    }

    /**
     * return the site list
     *
     * @returns {{}|*}
     */
    get sites() {
        return this._sites;
    }

    /**
     * amount of registered sites
     *
     * @returns int
     */
    get siteCount() {
        return Object.keys(this._sites).length;
    }

    /**
     * returns a info list of all enabled websites
     *
     * @returns {Array}
     */
    get siteList() {
        return Object.keys(this._sites).map(siteKey => {
            return {
                name: this._sites[siteKey].name,
                title: this._sites[siteKey].title,
                description: this._sites[siteKey].description,
                key: this._sites[siteKey].key,
                url: this._sites[siteKey].url,
                logoUrl: this._sites[siteKey].logoUrl
            }
        });
    }

    /**
     * returns info for a specific site
     *
     * @returns {Array}
     */
    getSite(siteKey) {
        return {
            name: this._sites[siteKey].name,
            title: this._sites[siteKey].title,
            description: this._sites[siteKey].description,
            key: this._sites[siteKey].key,
            url: this._sites[siteKey].url,
            logoUrl: this._sites[siteKey].logoUrl
        }
    }
}