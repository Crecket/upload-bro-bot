var fs = require('fs');
var path = require('path');

var HelperInterface = require(path.join(__dirname, '/../HelperInterface'));

module.exports = class MySites extends HelperInterface {
    constructor() {
        super();
    }

    /**
     * Handle a query
     *
     * @param query
     * @returns {Promise}
     */
    handle(query) {
        return new Promise((resolve, reject) => {
            resolve("");
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

