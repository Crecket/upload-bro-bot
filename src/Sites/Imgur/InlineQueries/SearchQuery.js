const fs = require("fs");
const path = require("path");
const mime = require("mime");
const Logger = require("../../../Helpers/Logger.js");
const HelperInterface = require("../../../HelperInterface");
const ImgurHelperObj = require("../Helper");

module.exports = class SearchQuery extends HelperInterface {
    constructor(UploadBro) {
        super(UploadBro);

        this._UploadBro = UploadBro;

        // create imgur helper
        this._ImgurHelper = new ImgurHelperObj(UploadBro);
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

            if (!user_info.provider_sites.imgur) {
                return {
                    options: {
                        switch_pm_text:
                            "Imgur service not connected to your account",
                        switch_pm_parameter: "login"
                    }
                };
            }

            // search for this file
            const file_results = await this._ImgurHelper.imageList(user_info);

            const resultList = [];
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
