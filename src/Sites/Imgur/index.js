const fs = require("fs");
const path = require("path");
const Logger = require("../../Helpers/Logger");

const SiteInteface = require("../SiteInterface.js");
const UploadObj = require("./Queries/Upload");
const HelpObj = require("./Commands/Help");
const SearchQueryObj = require("./InlineQueries/SearchQuery");

module.exports = class Imgur extends SiteInteface {
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
            // register button queries
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
     * return this site's short name
     *
     * @returns {string}
     */
    get name() {
        return "Imgur";
    }

    /**
     * return this site's full title
     *
     * @returns {string}
     */
    get title() {
        return "Imgur";
    }

    /**
     * return this site's full title
     *
     * @returns {string}
     */
    get description() {
        return "The most awesome images on the Internet";
    }

    /**
     * the site's key
     *
     * @returns {string}
     */
    get key() {
        return "imgur";
    }

    /**
     * the main url for this service
     *
     * @returns {string}
     */
    get url() {
        return "https://imgur.com";
    }

    /**
     * the logo url
     *
     * @returns {string}
     */
    logoUrl(type = "png") {
        switch (type) {
            case "png":
                return "/assets/img/imgur.png";
            case "svg":
                return "/assets/img/imgur.svg";
        }
        return "/assets/img/imgur.png";
    }

    /**
     * the logo url
     *
     * @returns {string}
     */
    get logoUrlSvg() {
        return "/assets/img/imgur.svg";
    }

    /**
     * supported file types we will allow uploads for, true = wildcard
     *
     * @returns {boolean|[string]}
     */
    get supportedExtensions() {
        return ["jpg", "jpeg", "png", "gif", "apng", "tiff", "pdf", "xcf"];
    }

    /**
     * A list with supported features
     *
     * @returns {[string,string]}
     */
    get supportedFeatures() {
        return ["inlineQuery_search", "query_uploadImage"];
    }
};
