var fs = require('fs');
var path = require('path');
var appRoot = require('app-root-path');
var requireFix = appRoot.require;

var SiteInteface = requireFix('/src/Sites/SiteInterface.js');

var ImgurHelperObj = requireFix('/src/Sites/Imgur/Helper');

module.exports = class Imgur extends SiteInteface {
    constructor(app) {
        super(app);

        this._app = app;
    }

    /**
     * Load all commands for this website
     */
    register() {
        return Promise.resolve();
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
    get logoUrl() {
        return "/assets/img/imgur.png";
    }

    /**
     * supported file types we will allow uploads for, true = wildcard
     *
     * @returns {boolean|[string]}
     */
    get supportedExtensions() {
        return ["jpg", "jpeg", "png", "gif", "apng", "tiff", "pdf", "xcf"];
    }
}

