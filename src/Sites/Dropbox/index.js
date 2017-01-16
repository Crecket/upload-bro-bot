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
     * return this site name
     *
     * @returns {string}
     */
    get name(){
        return 'Dropbox';
    }
}

