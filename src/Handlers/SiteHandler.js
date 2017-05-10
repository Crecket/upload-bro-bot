const FeatureLookup = require("../Sites/FeatureLookup.js");

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
        const siteKey = name.toLowerCase();
        if (this._sites[siteKey]) {
            return this._sites[siteKey].enabled;
        }
        return false;
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
     * @returns {Object}
     */
    get siteList() {
        let siteList = {};
        Object.keys(this._sites).map(siteKey => {
            // only add it if site is enabled
            if (this.isActive(siteKey))
                siteList[siteKey] = this.getSiteBasic(siteKey);
        });
        return siteList;
    }

    /**
     * returns info for a specific site
     *
     * @param siteKey
     * @returns {*}
     */
    getSiteBasic(siteKey) {
        const siteInfo = this._sites[siteKey];

        // only return the site info if it is enabled
        if (siteInfo && siteInfo.enabled) {
            return {
                // static properties
                enabled: this._sites[siteKey].enabled,
                name: this._sites[siteKey].name,
                title: this._sites[siteKey].title,
                description: this._sites[siteKey].description,
                slogan: this._sites[siteKey].slogan,
                key: this._sites[siteKey].key,
                url: this._sites[siteKey].url,
                supportedExtensions: this._sites[siteKey].supportedExtensions,
                // all available logos
                logos: {
                    png: this._sites[siteKey].logoUrl("png"),
                    svg: this._sites[siteKey].logoUrl("svg")
                },
                // documentation and comments
                documentation: this.generateDocumentation(this._sites[siteKey])
            };
        }
        return false;
    }

    /**
     * Takes a site object and returns documentation in markdown
     *
     * @param site
     * @returns {string}
     */
    generateDocumentation(site) {
        let supportedFeatures = site.supportedFeatures.length > 0
            ? `### Supported features\n\n` +
                  site.supportedFeatures
                      .map(type => FeatureLookup[type])
                      .join("\n")
            : "";

        return `## ${site.title}\n${supportedFeatures}`;
    }
};
