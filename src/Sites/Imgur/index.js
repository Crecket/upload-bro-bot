var fs = require('fs');
var path = require('path');

var SiteInteface = require(path.join(__dirname, '../SiteInterface.js'));

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
        return 'Imgur';
    }

    /**
     * return this site's full title
     *
     * @returns {string}
     */
    get title(){
        return 'Imgur';
    }

    /**
     * return this site's full title
     *
     * @returns {string}
     */
    get description(){
        return 'The most awesome images on the Internet';
    }

    /**
     * the main url for this service
     *
     * @returns {string}
     */
    get url(){
        return "https://imgur.com";
    }
}

