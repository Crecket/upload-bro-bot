const fs = require('fs');
const path = require('path');
const winston = rootRequire('src/Helpers/Logger.js');

const HelperInterface = rootRequire('src/HelperInterface');
const Utils = rootRequire('src/Utils');

const UploadStartObj = rootRequire('src/Queries/Generic/UploadStart');
const UploadFinishObj = rootRequire('src/Queries/Generic/UploadFinish');
const GoogleHelperObj = rootRequire('src/Sites/Google/Helper');

module.exports = class Upload extends HelperInterface {

    constructor(app) {
        super(app);

        this._app = app;

        // create google helper
        this._GoogleHelper = new GoogleHelperObj(app);
        this.UploadStart = new UploadStartObj(app);
        this.UploadFinish = new UploadFinishObj(app);
    }

    /**
     * Handle a download query request
     *
     * @param query
     * @returns {Promise}
     */
    handle(query) {
        // console.log(query);
        return new Promise((resolve, reject) => {

            // generic start upload event
            this.UploadStart
                .handle(query, 'google')
                // upload to google
                .then(resolveResults => this.uploadGoogle(resolveResults))
                // generic finish upload event
                .then(resolveResults => this.UploadFinish.handle(resolveResults))
                // final close event
                .then(resolveResults => {
                    // finished
                    resolve();
                })
                .catch(reject);
        });
    }

    /**
     * Upload file to google
     *
     * @param msgInfo
     * @param file_contents
     * @param file_location
     * @param userInfo
     * @returns {Promise}
     */
    async uploadGoogle(resolveResults) {
        try {
            // make sure we have a uploadbro folder
            const folder_id = await this._GoogleHelper.assertUploadFolder(resolveResults.userInfo);

            // store upload results
            resolveResults.upload_result = await this._GoogleHelper.uploadFile(
                resolveResults.userInfo,
                resolveResults.file_location,
                path.basename(resolveResults.file_location),
                folder_id
            );

            return resolveResults;
        } catch (ex) {
            // error result message
            this.editMessageError({
                chat_id: resolveResults.msgInfo.chat_id,
                message_id: resolveResults.msgInfo.message_id
            });
            throw new Error(ex);
        }
    }

    /**
     * Get event name for this query
     * @returns {string}
     */
    get event() {
        return "upload_google";
    }
}

