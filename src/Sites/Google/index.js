var fs = require('fs');
var path = require('path');

var SiteInteface = require(path.join(__dirname, '../SiteInterface.js'));
var DownloadObj = require(path.join(__dirname, 'Queries/Download'));
var UploadObj = require(path.join(__dirname, 'Queries/Upload'));

module.exports = class Google extends SiteInteface {
    constructor() {
        super();
    }

    /**
     * Load all commands for this website
     */
    register() {
        // this._app._QueryHandler.register(new DownloadObj(this));
        // this._app._QueryHandler.register(new UploadObj(this));

        return Promise.resolve();
    }

    /**
     * return this site name
     *
     * @returns {string}
     */
    get name() {
        return 'Google';
    }
}

