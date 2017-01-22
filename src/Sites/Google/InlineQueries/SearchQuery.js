var fs = require('fs');
var path = require('path');
var path = require('path');
var mime = require('mime');
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
            this._app._UserHelper.getUser(inline_query.from.id).then((user_info) => {
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
                ).then((file_results) => {
                    console.log(file_results);
                    var resultList = [];
                    file_results.map((value, key) => {
                        resultList.push({
                            title: "title1",
                            caption: "caption1",
                            description: "description1",
                            type: "photo",
                            id: value.id,
                            photo_url: "https://lh4.googleusercontent.com/TbYLToSXtbfyKuYtnXSsjXJBuUYy7ZJogvvBL8lqvscGS_yg8g7QN9b7R4Z0HSbsI7FYcQ=w320",
                            thumb_url: "https://lh4.googleusercontent.com/TbYLToSXtbfyKuYtnXSsjXJBuUYy7ZJogvvBL8lqvscGS_yg8g7QN9b7R4Z0HSbsI7FYcQ=w320"
                        })
                    })

                    // resolve this list
                    resolve(resultList, {
                        cacheTime: 1
                    })

                }).catch(err => console.log(err));
            }).catch(err => console.log(err));
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

