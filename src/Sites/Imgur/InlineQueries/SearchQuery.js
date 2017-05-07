const fs = require("fs");
const path = require("path");
const mime = require("mime");
const Logger = require("../../../Helpers/Logger.js");
const HelperInterface = require("../../../HelperInterface");
const ImgurHelperObj = require("../../../Sites/Imgur/Helper");

module.exports = class SearchQuery extends HelperInterface {
    constructor(app) {
        super(app);

        this._app = app;

        // create google helper
        this._ImgurHelper = new ImgurHelperObj(app);
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
            this._app._UserHelper
                .getUser(inline_query.from.id)
                .then(user_info => {
                    if (!user_info) {
                        return resolve(
                            "It looks like you're not registered in our system."
                        );
                    }

                    if (!user_info.provider_sites.imgur) {
                        return resolve(
                            [], // no results
                            {
                                switch_pm_text: "Imgur service not connected to your account",
                                switch_pm_parameter: "login"
                            }
                        );
                    }

                    // search for this file
                    this._ImgurHelper
                        .imageList(user_info)
                        .then(file_results => {
                            Logger.trace(file_results);

                            var resultList = [];
                            file_results.map((file, key) => {
                                let newUrl = file.link.replace(".png", ".jpg");

                                // create a new article
                                var fileResult = {
                                    type: "photo",
                                    id: file.id,
                                    title: file.name ? file.name : file.id,
                                    photo_url: newUrl,
                                    thumb_url: newUrl
                                };
                                // optional thumbnail url
                                if (file.link) {
                                    fileResult.thumb_url = file.link;
                                }

                                resultList.push(fileResult);
                            });

                            // resolve this list
                            resolve(resultList, {
                                cacheTime: 1
                            });
                        })
                        .catch(err => Logger.error(err));
                })
                .catch(err => Logger.error(err));
        });
    }

    /**
     * The regex we want to match
     * @returns {RegExp}
     */
    get match() {
        return /imgur(.*)$/;
    }

    /**
     * Get event name for this query
     * @returns {string}
     */
    get name() {
        return "imgur_search";
    }
};
