var fs = require('fs');
var path = require('path');

var HelperInterface = require(path.join(__dirname, './../../../HelperInterface'));
var GoogleHelperObj = require(path.join(__dirname, '../GoogleHelper'));

module.exports = class Upload extends HelperInterface {
    constructor(app) {
        super(app);

        this._app = app;

        // create google helper
        this._GoogleHelper = new GoogleHelperObj(app);
    }

    handle(msg, match) {
        var userId = msg.from.id;

    }

    /**
     * Get event name for this query
     * @returns {string}
     */
    get event() {
        return "upload_google";
    }
}

