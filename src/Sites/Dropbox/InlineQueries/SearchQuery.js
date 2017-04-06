const fs = require('fs');
const path = require('path');
const mime = require('mime');
const Logger = rootRequire('src/Helpers/Logger.js');

const HelperInterface = rootRequire('src/HelperInterface');
const DropboxHelperObj = rootRequire('src/Sites/Dropbox/Helper');

module.exports = class SearchQuery extends HelperInterface {
    constructor(app) {
        super(app);

        this._app = app;

        // create google helper
        this._DropboxHelper = new DropboxHelperObj(app);
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

                // check if we have
                if (!user_info.provider_sites.dropbox) {
                    return resolve(
                        [], // no results
                        {
                            switch_pm_text: "Dropbox service not connected to your account",
                            switch_pm_parameter: "login"
                        }
                    );
                }

                // search for this file
                this._DropboxHelper.searchFile(
                    user_info, // tokens
                    match, // file name to search for
                    {}
                ).then((file_results) => {

                    // Logger.debug(file_results);
                    var resultList = [];
                    file_results.map((file, key) => {
                        if (file.match_type['.tag'] !== "file_name") {
                            // not a file type
                            return null;
                        }

                        // create a shareable url
                        var shareUrl = this._DropboxHelper.createShareLink(user_info, file.metadata.path);

                        // create a new article
                        var fileResult = {
                            type: "article",
                            id: file.meta_data.id,
                            title: file.meta_data.name,
                            url: shareUrl,
                            input_message_content: {
                                message_text: "<a href='" + shareUrl + "'>" + file.meta_data.name + "</a>",
                                parse_mode: "HTML"
                            }
                        };

                        resultList.push(fileResult)
                    })

                    // resolve this list
                    resolve(resultList, {
                        cacheTime: 1
                    })

                }).catch(err => Logger.error(err));
            }).catch(err => Logger.error(err));
        });
    }

    /**
     * The regex we want to match
     * @returns {RegExp}
     */
    get match() {
        return /dropbox(.*)$/;
    }

    /**
     * Get event name for this query
     * @returns {string}
     */
    get name() {
        return "dropbox_search";
    }
}

