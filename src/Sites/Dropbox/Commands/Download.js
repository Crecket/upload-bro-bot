var fs = require('fs');
var path = require('path');

var CommandInterface = require(path.join(__dirname, './../../../Commands/CommandInterface'));
var DropboxHelper = require(path.join(__dirname, '../DropboxHelper'));

module.exports = class Download extends CommandInterface {
    constructor() {
        super();
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
}

