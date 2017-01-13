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
        this._app._CommandHandler.register('download', /\/download/, require(path.join(__dirname, 'Commands/Download')));
        this._app._CommandHandler.register('upload', /\/upload/, require(path.join(__dirname, 'Commands/Upload')));

        return Promise.resolve();
    }
}

