const fs = require('fs');
const path = require('path');
const winston = rootRequire('src/Helpers/Winston.js');

const SiteInteface = require(__base + 'src/Sites/SiteInterface.js');

const UploadObj = require(__base + 'src/Sites/Dropbox/Queries/Upload');

module.exports = class Dropbox extends SiteInteface {
    constructor(app) {
        super();

        this._app = app;
    }

    /**
     * Load all commands for this website
     */
    register() {
        // register commands
        this._app._QueryHandler.register(new UploadObj(this._app));

        return Promise.resolve();
    }

    /**
     * return this site's short name
     *
     * @returns {string}
     */
    get name(){
        return 'Dropbox';
    }

    /**
     * return this site's full title
     *
     * @returns {string}
     */
    get title(){
        return 'Dropbox';
    }

    /**
     * return this site's full title
     *
     * @returns {string}
     */
    get description(){
        return 'Securely Share, Sync & Collaborate.';
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
    get url(){
        return "https://www.dropbox.com";
    }

    /**
     * the logo url
     *
     * @returns {string}
     */
    get logoUrl() {
        return "/assets/img/dropbox.png";
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

