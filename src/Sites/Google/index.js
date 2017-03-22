var fs = require('fs');
var path = require('path');
const winston = rootRequire('src/Helpers/Winston.js');

var SiteInteface = require(__base + 'src/Sites/SiteInterface.js');
var UploadObj = require('./Queries/Upload');
var SearchQueryObj = require('./InlineQueries/SearchQuery');

module.exports = class Google extends SiteInteface {
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

        // register inline queries
        this._app._InlineQueryHandler.register(new SearchQueryObj(this._app));

        return Promise.resolve();
    }

    /**
     * return this site short name
     *
     * @returns {string}
     */
    get name() {
        return 'Google';
    }

    /**
     * return this site's full title
     *
     * @returns {string}
     */
    get title() {
        return 'Google Drive';
    }

    /**
     * return this site's full title
     *
     * @returns {string}
     */
    get description() {
        return 'Cloud Storage & File Backup for Photos, Docs & More';
    }

    /**
     * the site's key
     *
     * @returns {string}
     */
    get key() {
        return "google";
    }

    /**
     * the main url for this service
     *
     * @returns {string}
     */
    get url() {
        return "https://drive.google.com";
    }

    /**
     * the logo url
     *
     * @returns {string}
     */
    logoUrl(type = "png") {
        switch(type){
            case "png":
                return "/assets/img/google.png";
            case "svg":
                return "/assets/img/google.svg";
        }
        return "/assets/img/google.png";
    }

    /**
     * supported file types we will allow uploads for, true = wildcard
     *
     * @returns {boolean|[string]}
     */
    get supportedExtensions() {
        return true;
    }
}

