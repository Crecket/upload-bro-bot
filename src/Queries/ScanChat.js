const fs = require('fs');
const path = require('path');
const winston = rootRequire('src/Helpers/Logger.js');

var HelperInterface = rootRequire('src/HelperInterface');

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
                    winston.info(res);
                    resolve(query.id);
                })
                .catch((err) => {
                    winston.error('getUpdates error', err);
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

