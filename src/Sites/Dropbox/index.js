var fs = require('fs');
var path = require('path');

var SiteInteface = require(path.join(__dirname, '../SiteInterface'));
var DropboxHelper = require(path.join(__dirname, './DropboxHelper'));

module.exports = class Dropbox extends SiteInteface {
    constructor(db, bot, commandHandler) {
        super();

        this._db = db;
        this._bot = bot;
        this._commandHandler = commandHandler;
    }

    /**
     * Load all commands for this website
     */
    register() {
        this._commandHandler.register('login', /\/login/, require(path.join(__dirname, 'Commands/Login')));
        this._commandHandler.register('download', /\/download/, require(path.join(__dirname, 'Commands/Download')));
        this._commandHandler.register('upload', /\/upload/, require(path.join(__dirname, 'Commands/Upload')));

        return Promise.resolve();
    }
}

