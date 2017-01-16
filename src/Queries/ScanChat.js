var fs = require('fs');
var path = require('path');

var HelperInterface = require(path.join(__dirname, '/../HelperInterface'));

module.exports = class ScanChat extends HelperInterface {
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
            this._app._TelegramBot.getUpdates().bind(this)
                .then((res) => {
                    console.log('123', res[0]);
                    resolve(query.id);
                })
                .catch((err) => {
                    console.error('321', err);
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

