var fs = require('fs');
var path = require('path');

var SiteInteface = require(path.join(__dirname, '../SiteInterface.js'));

var DownloadObj = require(path.join(__dirname, 'Commands/Download'));
var UploadObj = require(path.join(__dirname, 'Commands/Upload'));

module.exports = class Dropbox extends SiteInteface {
    constructor(app) {
        super();

        this._app = app;
    }

    /**
     * Load all commands for this website
     */
    register() {
        // this._app._CommandHandler.register('download', /\/download/, );
        this._app._CommandHandler.register(new UploadObj(this._app));

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

