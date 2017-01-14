var fs = require('fs');
var path = require('path');

var SiteInteface = require(path.join(__dirname, '../SiteInterface.js'));

module.exports = class Google extends SiteInteface {
    constructor() {
        super();
    }

    /**
     * Load all commands for this website
     */
    register() {
        // this._commandHandler.register('login', /\/login/, require(__dirname + '/Commands/Login'));

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

