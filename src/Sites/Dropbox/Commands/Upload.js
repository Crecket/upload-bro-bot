var fs = require('fs');
var path = require('path');

var HelperInterface = require(path.join(__dirname, './../../../HelperInterface'));
var DropboxHelper = require(path.join(__dirname, '../DropboxHelper'));

module.exports = class Upload extends HelperInterface {
    constructor(app) {
        super(app);

        this._app = app;
    }

    handle(msg, match) {
        var userId = msg.from.id;

        // super._logger.debug("Upload command: ", userId);
        //
        // // get the users collection
        // var usersCollection = this._db.collection('users');
        //
        // // Find some documents
        // usersCollection.findOne({id: userId})
        //     .then((err, user) => {
        //         if (user) {
        //             super._logger.debug("User found: ", user);
        //         } else {
        //             super._logger.debug("No user found for: ", userId);
        //         }
        //     })
        //     .catch(console.error);
    }

    get name() {
        return "upload_dropbox";
    }

    get pattern() {
        return /\/upload dropbox/;
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

