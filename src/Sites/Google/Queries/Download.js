var fs = require('fs');
var path = require('path');

var HelperInterface = require(path.join(__dirname, './../../../HelperInterface'));
var GoogleHelperObj = require(path.join(__dirname, '../GoogleHelper'));

module.exports = class Download extends HelperInterface {
    constructor(app) {
        super(app);

        this._app = app;

        // create google helper
        this._GoogleHelper = new GoogleHelperObj(app);
    }

    handle(msg, match) {
        var userId = msg.from.id;

        super._logger.debug("Download command: ", userId);

        // get the users collection
        var usersCollection = super._app._db.collection('users');

        // Find some documents
        usersCollection.findOne({id: userId})
            .then((err, user) => {
                if (user) {
                    super._logger.debug("User found: ", user);
                } else {
                    super._logger.debug("No user found for: ", userId);
                }
            })
            .catch(console.error);
    }

    /**
     * Get event name for this query
     * @returns {string}
     */
    get event() {
        return "download_google";
    }
}

