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
     * @returns {Object}
     */
    get siteList() {
        let siteList = {};
        Object.keys(this._sites).map(siteKey => {
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
        return !this._sites[siteKey]
            ? false
            : {
                // static properties
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
                documentation: this.generateDocumentation(
                    this._sites[siteKey]
                )
            };
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
