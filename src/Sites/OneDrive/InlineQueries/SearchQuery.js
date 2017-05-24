const fs = require("fs");
const path = require("path");
const mime = require("mime");
const Logger = require("../../../Helpers/Logger");
const HelperInterface = require("../../../HelperInterface");
const GoogleHelperObj = require("../Helper");

module.exports = class SearchQuery extends HelperInterface {
    constructor(UploadBro) {
        super(UploadBro);

        this._UploadBro = UploadBro;

        // create google helper
        this._GoogleHelper = new GoogleHelperObj(UploadBro);
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

            if (!user_info.provider_sites.google) {
                return {
                    options: {
                        switch_pm_text: "Google Drive service not connected to your account",
                        switch_pm_parameter: "login"
                    }
                };
            }

            // search for this file
            const file_results = await this._GoogleHelper.searchFile(
                user_info, // tokens
                match // file name to search for
            );

            // Logger.trace(file_results);
            const resultList = [];
            file_results.map((file, key) => {
                const fileUrl = this._GoogleHelper.getShareableLink(file.id);

                // create a new article
                var fileResult = {
                    type: "article",
                    id: file.id,
                    title: file.name,
                    url: file.webViewLink,
                    input_message_content: {
                        message_text: `<a href="${fileUrl}">${file.name}</a>`,
                        parse_mode: "HTML"
                    }
                };
                // optional thumbnail url
                if (file.thumbnailLink) {
                    fileResult.thumb_url = file.thumbnailLink;
                }

                resultList.push(fileResult);
            });

            console.log(resultList.length);

            // resolve this list
            return { inline_results: resultList };
        } catch (ex) {
            Logger.error(ex);
            return { inline_results: [] };
        }
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
};
