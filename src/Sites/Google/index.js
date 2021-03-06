const fs = require("fs");
const path = require("path");
const Logger = require("../../Helpers/Logger");

const SiteInteface = require("../SiteInterface");
const UploadObj = require("./Queries/Upload");
const HelpObj = require("./Commands/Help");
const SearchQueryObj = require("./InlineQueries/SearchQuery");

module.exports = class Google extends SiteInteface {
    constructor(UploadBro, register = true) {
        super(UploadBro);
        this._UploadBro = UploadBro;

        // on false, commands aren't registered by default
        this._register = register;
    }

    /**
     * Load all commands for this website
     * @returns {Promise.<T>}
     */
    register() {
        if (this._register) {
            // register commands
            this._UploadBro._QueryHandler.register(
                new UploadObj(this._UploadBro)
            );

            // register commands
            this._UploadBro._CommandHandler.register(
                new HelpObj(this._UploadBro)
            );

            // register inline queries
            this._UploadBro._InlineQueryHandler.register(
                new SearchQueryObj(this._UploadBro)
            );
        }
        return Promise.resolve();
    }

    /**
     * On false, this site isn't used and allowed in uploadbro
     *
     * @returns {boolean}
     */
    get enabled() {
        return true;
    }

    /**
     * return this site short name
     *
     * @returns {string}
     */
    get name() {
        return "Google";
    }

    /**
     * return this site's full title
     *
     * @returns {string}
     */
    get title() {
        return "Google Drive";
    }

    /**
     * return this site's description
     *
     * @returns {string}
     */
    get description() {
        return "Cloud Storage & File Backup for Photos, Docs & More";
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
        switch (type) {
            case "png":
                return "/assets/img/google.png";
            case "svg":
                return "/assets/img/google.svg";
        }
        return "/assets/img/google.png";
    }

    /**
     * the logo url
     *
     * @returns {string}
     */
    get logoUrlSvg() {
        return "/assets/img/google.svg";
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
        return ["inlineQuery_search", "query_upload"];
    }
};
