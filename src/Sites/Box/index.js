const fs = require('fs');
const path = require('path');
const Logger = rootRequire('src/Helpers/Logger.js');

const SiteInteface = require('../SiteInterface.js');

const UploadObj = rootRequire('src/Sites/Box/Queries/Upload');
// const SearchQueryObj = rootRequire('src/Sites/Box/InlineQueries/SearchQuery');

module.exports = class Box extends SiteInteface {
    constructor(app) {
        super(app);

        this._app = app;
    }

    /**
     * Load all commands for this website
     */
    register() {
        // register commands
        this._app._QueryHandler.register(new UploadObj(this._app));
        //
        // // register inline queries
        // this._app._InlineQueryHandler.register(new SearchQueryObj(this._app));

        return Promise.resolve();
    }

    /**
     * return this site's short name
     *
     * @returns {string}
     */
    get name() {
        return "Box";
    }

    /**
     * return this site's full title
     *
     * @returns {string}
     */
    get title() {
        return "Box";
    }

    /**
     * return this site's slogan
     *
     * @returns {string}
     */
    get slogan() {
        return "Secure File Sharing, Storage, and Collaboration";
    }

    /**
     * return this site's description
     *
     * @returns {string}
     */
    get description() {
        return "Secure File Sharing, Storage, and Collaboration";
    }

    /**
     * the site's key
     *
     * @returns {string}
     */
    get key() {
        return "box";
    }

    /**
     * the main url for this service
     *
     * @returns {string}
     */
    get url() {
        return "https://www.box.com/home";
    }

    /**
     * the logo url
     *
     * @returns {string}
     */
    logoUrl(type = "png") {
        switch (type) {
            case "png":
                return "/assets/img/box.png";
            case "svg":
                return "/assets/img/box.svg";
        }
        return "/assets/img/box.png";
    }

    /**
     * the logo url
     *
     * @returns {string}
     */
    get logoUrlSvg() {
        return "/assets/img/box.svg";
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
        // return ["inlineQuery_search", "query_upload"];
    }
}

