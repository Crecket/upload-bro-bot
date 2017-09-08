const fs = require("fs");
const path = require("path");
const mime = require("mime");
const Logger = require("../../../Helpers/Logger.js");
const HelperInterface = require("../../../HelperInterface");
const DropboxHelperObj = require("../Helper");

module.exports = class SearchQuery extends HelperInterface {
    constructor(UploadBro) {
        super(UploadBro);

        this._UploadBro = UploadBro;

        // create dropbox helper
        this._DropboxHelper = new DropboxHelperObj(UploadBro);
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
                        switch_pm_text:
                            "It looks like you're not registered in our system.",
                        switch_pm_parameter: "start"
                    }
                };
            }

            if (!user_info.provider_sites.dropbox) {
                return {
                    options: {
                        switch_pm_text:
                            "Dropbox service not connected to your account",
                        switch_pm_parameter: "login"
                    }
                };
            }

            // search for this file
            const file_results = await this._DropboxHelper.searchFile(
                user_info, // tokens
                match, // file name to search for
                {}
            );

            // Logger.trace(file_results);
            const resultList = [];
            file_results.map((file, key) => {
                if (file.match_type[".tag"] !== "file_name") {
                    // not a file type
                    return null;
                }

                // create a shareable url
                const shareUrl = this._DropboxHelper.createShareLink(
                    user_info,
                    file.metadata.path
                );

                // create a new article
                var fileResult = {
                    type: "article",
                    id: file.meta_data.id,
                    title: file.meta_data.name,
                    url: shareUrl,
                    input_message_content: {
                        message_text: `<a href="${shareUrl}">${file.meta_data
                            .name}</a>`,
                        parse_mode: "HTML"
                    }
                };
                resultList.push(fileResult);
            });

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
        return /dropbox(.*)$/;
    }

    /**
     * Get event name for this query
     * @returns {string}
     */
    get name() {
        return "dropbox_search";
    }
};
