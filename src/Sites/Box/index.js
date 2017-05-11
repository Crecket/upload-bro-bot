const fs = require("fs");
const path = require("path");
const Logger = require("../../Helpers/Logger.js");

const SiteInteface = require("../SiteInterface.js");
const UploadObj = require("./Queries/Upload");
const HelpObj = require("./Commands/Help");
const SearchQueryObj = require("./InlineQueries/SearchQuery");

module.exports = class Box extends SiteInteface {
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

            // // register inline queries
            // this._UploadBro._InlineQueryHandler.register(
            //     new SearchQueryObj(this._UploadBro)
            // );
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
};
