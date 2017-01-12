var ProviderInterface = require('./ProviderInterface');

module.exports = class Start extends ProviderInterface {
    constructor() {
        super();
    }

    handle(msg, match) {
        var userId = msg.from.id;

        super._logger.debug("Start command: ", userId);

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
}

