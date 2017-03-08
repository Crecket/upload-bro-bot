/* global rootRequire */

const fs = require('fs');
const path = require('path');
const winston = rootRequire('src/Helpers/Winston.js');

const HelperInterface = rootRequire('src/HelperInterface');
const Utils = rootRequire('src/Utils');

const UploadStartObj = rootRequire('src/Queries/Generic/UploadStart');
const UploadFinishObj = rootRequire('src/Queries/Generic/UploadFinish');
const ImgurHelperObj = rootRequire('src/Sites/Imgur/Helper');

module.exports = class Upload extends HelperInterface {


    constructor(app) {
        super(app);

        this._app = app;

        // create google helper
        this._ImgurHelper = new ImgurHelperObj(app);
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
                .handle(query, 'imgur')
                // upload to dropbox
                .then(resolveResults => this.uploadImgur(resolveResults))
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
    uploadImgur(resolveResults) {
        return new Promise((resolve, reject) => {
            // upload to google
            this._ImgurHelper.uploadFile(
                resolveResults.userInfo,
                resolveResults.file_location,
                path.basename(resolveResults.file_location)
            ).then((upload_result) => {
                // add new upload location
                resolveResults.upload_result = upload_result;

                // resolve the results
                resolve(resolveResults);
            }).catch(err => {
                // dropbox upload failed
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
        return "upload_imgur";
    }
}

