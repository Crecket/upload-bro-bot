const fs = require('fs');
const path = require('path');
const mime = require('mime');
const winston = rootRequire('src/Helpers/Winston.js');

const HelperInterface = rootRequire('src/HelperInterface');
const Utils = rootRequire('src/Utils');

const GoogleHelperObj = rootRequire('src/Sites/Google/Helper');

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
                    return resolve(
                        [], // no results
                        {
                            switch_pm_text: "Google service not connected to your account",
                            switch_pm_parameter: "login"
                        }
                    );
                }

                // search for this file
                this._GoogleHelper.searchFile(
                    user_info, // tokens
                    match, // file name to search for
                    {}
                ).then((file_results) => {
                    winston.debug(file_results);
                    var resultList = [];
                    file_results.map((file, key) => {

                        var fileUrl = this._GoogleHelper.getShareableLink(file.id);

                        // create a new article
                        var fileResult = {
                            type: "article",
                            id: file.id,
                            title: file.name,
                            url: file.webViewLink,
                            input_message_content: {
                                message_text: "<a href='" + fileUrl + "'>" + file.name + "</a>",
                                parse_mode: "HTML"
                            }
                        };
                        // optional thumbnail url
                        if (file.thumbnailLink) {
                            fileResult.thumb_url = file.thumbnailLink;
                        }

                        resultList.push(fileResult)
                    })

                    // resolve this list
                    resolve(resultList, {
                        cacheTime: 1
                    })

                }).catch(err => winston.error(err));
            }).catch(err => winston.error(err));
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

