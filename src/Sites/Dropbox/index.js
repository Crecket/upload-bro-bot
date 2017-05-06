const fs = require("fs");
const path = require("path");
const SiteInteface = require("../SiteInterface");

// queries and commands
const SearchQueryObj = require("./InlineQueries/SearchQuery");
const UploadObj = require("./Queries/Upload");

module.exports = class Dropbox extends SiteInteface {
    constructor(app, register = true) {
        super(app);
        this._app = app;

        // on false, commands aren't registered by default
        this._register = register;
    }

    /**
     * Load all commands for this website
     * @returns {Promise.<T>}
     */
    register() {
        if(this._register) {
            // register commands
            this._app._QueryHandler.register(new UploadObj(this._app));

            // register inline queries
            // this._app._InlineQueryHandler.register(new SearchQueryObj(this._app));
        }
        return Promise.resolve();
    }

    /**
     * return this site's short name
     *
     * @returns {string}
     */
    get name() {
        return "Dropbox";
    }

    /**
     * return this site's full title
     *
     * @returns {string}
     */
    get title() {
        return "Dropbox";
    }

    /**
     * return this site's slogan
     *
     * @returns {string}
     */
    get slogan() {
        return "Securely Share, Sync & Collaborate.";
    }

    /**
     * return this site's description
     *
     * @returns {string}
     */
    get description() {
        return "Securely Share, Sync & Collaborate.";
    }

    /**
     * the site's key
     *
     * @returns {string}
     */
    get key() {
        return "dropbox";
    }

    /**
     * the main url for this service
     *
     * @returns {string}
     */
    get url() {
        return "https://www.dropbox.com";
    }

    /**
     * the logo url
     *
     * @returns {string}
     */
    logoUrl(type = "png") {
        switch (type) {
            case "png":
                return "/assets/img/dropbox.png";
            case "svg":
                return "/assets/img/dropbox.svg";
        }
        return "/assets/img/dropbox.png";
    }

    /**
     * the logo url
     *
     * @returns {string}
     */
    get logoUrlSvg() {
        return "/assets/img/dropbox.svg";
    }

    /**
     * supported file types we will allow uploads for, true = wildcard
     *
     * @returns {boolean|[string]}
     */
    get supportedExtensions() {
        return true;
    }

    /**
     * A list with supported features
     *
     * @returns {[string,string]}
     */
    get supportedFeatures() {
        return ["query_upload"];
    }
};
