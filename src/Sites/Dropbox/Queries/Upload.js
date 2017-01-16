var fs = require('fs');
var path = require('path');

var HelperInterface = require(path.join(__dirname, '../HelperInterface'));

module.exports = class MySites extends HelperInterface {
    constructor(app) {
        super(app);

        this._app = app;
    }

    /**
     * Handle a query
     *
     * @param query
     * @returns {Promise}
     */
    handle(query) {
        return new Promise((resolve, reject) => {
            // get the user for this request
            this._app._UserHelper.getUser(query.from.id)
                .then((user_info) => {
                    if (user_info) {

                    } else {
                        var message = "We can't seem to find your telegram account in our system. ";
                        message += "Make sure you login first and connect the available services.";
                    }

                    // send the message
                    // super.sendMessage(query.message.chat.id, message, {
                    //     parse_mode: "HTML"
                    // }).then(() => {
                    //     resolve();
                    // }).catch(reject);
                    resolve();
                })
                .catch((err) => {
                    console.log(err);
                    reject();
                });
        })
    }

    /**
     * Get event name for this query
     * @returns {string}
     */
    get event() {
        return "my_sites";
    }
}

