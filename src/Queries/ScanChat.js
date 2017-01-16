var fs = require('fs');
var path = require('path');

var HelperInterface = require(path.join(__dirname, '/../HelperInterface'));

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
            this._app._TelegramBot.getUpdates()
                .then((res) => {
                    console.log(res);
                    resolve(query.id);
                })
                .catch((err) => {
                    console.error(err);
                    reject(query.id);
                });
        })
    }

    /**
     * Get event name for this query
     * @returns {string}
     */
    get event() {
        return "scan_chat";
    }
}

