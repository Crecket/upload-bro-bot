const fs = require("fs");
const path = require("path");
const Logger = require("../../Helpers/Logger");

const SiteInteface = require("../SiteInterface.js");
// const UploadObj = require("./Queries/Upload");
// const SearchQueryObj = require("./InlineQueries/SearchQuery");

// https://developers.gfycat.com/api/#browser-based-authentication

module.exports = class Gfycat extends SiteInteface {
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
            // // register commands
            // this._app._QueryHandler.register(new UploadObj(this._app));
            //
            // // register inline queries
            // this._app._InlineQueryHandler.register(
            //     new SearchQueryObj(this._app)
            // );
        }
        return Promise.resolve();
    }

    /**
     * On false, this site isn't used and allowed in uploadbro
     *
     * @returns {boolean}
     */
    get enabled(){
        return false;
    }

    /**
     * return this site's short name
     *
     * @returns {string}
     */
    get name() {
        return "Gfycat";
    }

    /**
     * return this site's full title
     *
     * @returns {string}
     */
    get title() {
        return "Gfycat";
    }

    /**
     * return this site's slogan
     *
     * @returns {string}
     */
    get slogan() {
        return "Create, discover and share awesome GIFs";
    }

    /**
     * return this site's full title
     *
     * @returns {string}
     */
    get description() {
        return "Create, discover and share awesome GIFs";
    }

    /**
     * the site's key
     *
     * @returns {string}
     */
    get key() {
        return "gfycat";
    }

    /**
     * the main url for this service
     *
     * @returns {string}
     */
    get url() {
        return "https://gfycat.com";
    }

    /**
     * the logo url
     *
     * @returns {string}
     */
    logoUrl(type = "png") {
        switch (type) {
            case "png":
                return "/assets/img/gfycat.png";
            case "svg":
                return "/assets/img/gfycat.svg";
        }
        return "/assets/img/gfycat.png";
    }

    /**
     * the logo url
     *
     * @returns {string}
     */
    get logoUrlSvg() {
        return "/assets/img/gfycat.svg";
    }

    /**
     * supported file types we will allow uploads for, true = wildcard
     *
     * @returns {boolean|[string]}
     */
    get supportedExtensions() {
        return [];
        // return ["jpg", "jpeg", "png", "gif", "apng", "tiff", "pdf", "xcf"];
    }

    /**
     * A list with supported features
     *
     * @returns {[string,string]}
     */
    get supportedFeatures() {
        return [];
        // return ["inlineQuery_search", "query_uploadImage"];
    }
};
