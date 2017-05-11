const fs = require("fs");
const path = require("path");
const Logger = require("../../../Helpers/Logger");
const HelperInterface = require("../../../HelperInterface");
const UploadStart = require("../../../Queries/Generic/UploadStart");
const UploadFinish = require("../../../Queries/Generic/UploadFinish");
const BoxHelper = require("../Helper");

module.exports = class Upload extends HelperInterface {
    constructor(app) {
        super(app);
        this._app = app;

        // create google helper
        this._BoxHelperObj = new BoxHelper(app);
        this.UploadStartObj = new UploadStart(app);
        this.UploadFinishObj = new UploadFinish(app);
    }

    /**
     * Handle a download query request
     *
     * @param query
     * @returns {Promise}
     */
    async handle(query) {
        try {
            // generic start upload event
            let resolveResults = await this.UploadStartObj.handle(query, "box");

            // upload to box
            resolveResults = await this.uploadBox(resolveResults);

            // generic finish upload event
            resolveResults = await this.UploadFinishObj.handle(resolveResults);

            return resolveResults;
        } catch (ex) {
            return false;
        }
    }

    /**
     * Upload file to google
     *
     * @param resolveResults
     * @returns {Promise}
     */
    async uploadBox(resolveResults) {
        try {
            // store upload results
            resolveResults.upload_result = await this._BoxHelperObj.uploadFile(
                resolveResults.userInfo,
                resolveResults.file_location
            );

            return resolveResults;
        } catch (ex) {
            // error result message
            this.editMessageError({
                ...resolveResults,
                error: ex,
                user_info: resolveResults.userInfo,
                chat_id: resolveResults.msgInfo.chat_id,
                message_id: resolveResults.msgInfo.message_id
            });

            // rethrow error
            return Promise.reject(ex);
        }
    }

    /**
     * Get event name for this query
     * @returns {string}
     */
    get event() {
        return "upload_box";
    }
};
