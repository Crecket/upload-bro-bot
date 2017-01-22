var fs = require('fs');
var path = require('path');
var appRoot = require('app-root-path');
var requireFix = appRoot.require;

var HelperInterface = requireFix('/src/HelperInterface');
var Utils = requireFix('/src/Utils');

var GoogleHelperObj = requireFix('/src/Sites/Google/Helper');

module.exports = class SearchQuery extends HelperInterface {
    constructor(app) {
        super(app);

        this._app = app;

        // create google helper
        this._GoogleHelper = new GoogleHelperObj(app);
    }

    /**
     * Handle a inline query search event
     *
     * @param inline_query
     * @param match
     * @returns {Promise}
     */
    handle(inline_query, match) {
        // console.log(query);
        return new Promise((resolve, reject) => {
            // first get user info
            this._app._UserHelper.getUser(query.from.id).then((user_info) => {
                if (!user_info) {
                    return resolve("It looks like you're not registered in our system.");
                }

                if (!user_info.provider_sites.google) {
                    return resolve("Google service not connected to your account");
                }

                // search for this file
                this._GoogleHelper.searchFile(
                    user_info.provider_sites.google, // tokens
                    match, // file name to search for
                    {}
                ).then((result) => {
                    console.log(result);
                }).catch(err => console.log(err));
            });
        });
    }

    /**
     * The regex we want to match
     * @returns {RegExp}
     */
    get match() {
        return /google (.+)$/;
    }

    /**
     * Get event name for this query
     * @returns {string}
     */
    get name() {
        return "google_search";
    }
}

