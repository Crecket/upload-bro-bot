var fs = require('fs');
var path = require('path');

var SiteInteface = require(path.join(__dirname, '../SiteInterface.js'));

module.exports = class Dropbox extends SiteInteface {
    constructor(app) {
        super();

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
}

