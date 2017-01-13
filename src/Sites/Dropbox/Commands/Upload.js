var fs = require('fs');
var path = require('path');

var CommandInterface = require('./CommandInterface');

module.exports = class Upload extends CommandInterface {
    constructor() {
        super();
    }

    handle(msg, match) {
        var userId = msg.from.id;

        super._logger.debug("Upload command: ", userId);

        // get the users collection
        var usersCollection = this._db.collection('users');

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


    test() {
        // create dropbox handler
        var filePath = path.join(__dirname, '../downloads/127251962/file_72.jpg');
        fs.readFile(filePath, {}, (err, data) => {
            if (!err) {
                this._DropboxHelper.uploadFile({
                    contents: data,
                    path: "/file_69.jpg"
                })
                    .then(super.Logger.debug)
                    .catch(super.Logger.debug);
            } else {
                console.log(err);
            }

        });
    }
}

