var CommandInterface = require('./CommandInterface');

module.exports = class Register extends CommandInterface {
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

