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
    uploadGoogle(resolveResults) {
        return new Promise((resolve, reject) => {
            // make sure we have a uploadbro folder
            this._GoogleHelper.assertUploadFolder(resolveResults.userInfo)
                .then(folder_id => {

                    // upload the file to google folder
                    this._GoogleHelper.uploadFile(
                        resolveResults.userInfo,
                        resolveResults.file_location,
                        path.basename(resolveResults.file_location),
                        folder_id
                    ).then((upload_result) => {
                        // add new upload location
                        resolveResults.upload_result = upload_result;

                        // resolve the results
                        resolve(resolveResults);
                    }).catch(err => {
                        // google upload failed
                        reject(err);

                        // error result message
                        this.editMessageError({
                            chat_id: resolveResults.msgInfo.chat_id,
                            message_id: resolveResults.msgInfo.message_id
                        });
                    });
                })
                .catch(err => {
                    // google folder creation failed
                    reject(err);

                    // error result message
                    this.editMessageError({
                        chat_id: resolveResults.msgInfo.chat_id,
                        message_id: resolveResults.msgInfo.message_id
                    });
                });
        })
    }

    /**
     * Get event name for this query
     * @returns {string}
     */
    get event() {
        return "upload_google";
    }
}

