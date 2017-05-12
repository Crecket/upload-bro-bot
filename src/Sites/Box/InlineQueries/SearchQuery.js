const fs = require("fs");
const path = require("path");
const mime = require("mime");
const Logger = require("../../../Helpers/Logger");
const HelperInterface = require("../../../HelperInterface");
const BoxHelperObj = require("../Helper");

module.exports = class SearchQuery extends HelperInterface {
    constructor(UploadBro) {
        super(UploadBro);

        this._UploadBro = UploadBro;

        // create box helper
        this._BoxHelper = new BoxHelperObj(UploadBro);
    }

    /**
     * Handle a inline query search event
     *
     * @param inline_query
     * @param match
     * @returns {Promise}
     */
    async handle(inline_query, match) {
        try {
            // first get user info
            const user_info = await this._UploadBro._UserHelper.getUser(
                inline_query.from.id
            );
            if (!user_info) {
                return {
                    options: {
                        switch_pm_text: "It looks like you're not registered in our system.",
                        switch_pm_parameter: "start"
                    }
                };
            }

            if (!user_info.provider_sites.box) {
                return {
                    options: {
                        switch_pm_text: "Box service not connected to your account",
                        switch_pm_parameter: "login"
                    }
                };
            }

            // search for this file
            const search_results = await this._BoxHelper
                .searchFile(
                    user_info, // tokens
                    match // file name to search for
                )
                .then(results => results.entries);
            return {};

            var resultList = [];
            search_results.map((file, key) => {
                var fileUrl = this._BoxHelper.getShareableLink(file.id);

                // create a new article
                var fileResult = {
                    type: "article",
                    id: file.id,
                    title: file.name,
                    url: file.webViewLink,
                    input_message_content: {
                        message_text: `<a href='${fileUrl}'>${file.name}</a>`,
                        parse_mode: "HTML"
                    }
                };
                // optional thumbnail url
                if (file.thumbnailLink) {
                    fileResult.thumb_url = file.thumbnailLink;
                }

                resultList.push(fileResult);
            });

            // resolve this list
            return { inline_results: resultList };
        } catch (ex) {
            Logger.error(ex);
            return {};
        }
    }

    /**
     * The regex we want to match
     * @returns {RegExp}
     */
    get match() {
        return /box (.+)$/;
    }

    /**
     * Get event name for this query
     * @returns {string}
     */
    get name() {
        return "box_search";
    }
};
