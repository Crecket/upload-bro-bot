var fs = require('fs');
var path = require('path');

var CommandInterface = require(path.join(__dirname, './../../../Commands/CommandInterface'));
var DropboxHelper = require(path.join(__dirname, '../DropboxHelper'));

module.exports = class Login extends CommandInterface {
    constructor() {
        super();
    }

    handle(msg) {
        var userId = msg.from.id;

        // get the users collection
        var usersCollection = this._db.collection('users');

        // Find some documents
        usersCollection.findOne({id: userId})
            .then((err, user) => {
                if (user) {
                    // already exists
                } else {

                }
            })
            .catch(console.error);
    }
}

