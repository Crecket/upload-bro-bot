let fs = require('fs');
let path = require('path');
let appRoot = require('app-root-path');
let requireFix = appRoot.require;

let HelperInterface = requireFix('/src/HelperInterface');
let Utils = requireFix('/src/Utils');

const UploadStartObj = requireFix('/src/Queries/Generic/UploadStart');
const UploadFinishObj = requireFix('/src/Queries/Generic/UploadFinish');
const DropboxHelperObj = requireFix('/src/Sites/Dropbox/Helper');

module.exports = class Upload extends HelperInterface {
    constructor(app) {
        super(app);

        this._app = app;

        // create dropbox helper
        this._DropboxHelper = new DropboxHelperObj(app);
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
                .handle(query)
                // get file contents
                .then(resolveResults => this.getContents(resolveResults))
                // upload to dropbox
                .then(resolveResults => this.uploadDropbox(resolveResults))
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
     * get file contents after telegram download
     *
     * @param msgInfo
     * @param file_location
     * @returns {Promise}
     */
    getContents(resolveResults) {
        return new Promise((resolve, reject) => {
            // get file contents
            fs.readFile(resolveResults.file_location, (err, file_contents) => {
                if (err || !file_contents) {
                    // error result message
                    reject(err);
                    this.editMessageError({
                        chat_id: resolveResults.msgInfo.chat_id,
                        message_id: resolveResults.msgInfo.message_id
                    });
                    return;
                }

                // resolve the file contents and file location
                resolveResults.file_contents = file_contents;
                resolve(resolveResults);
            });
        });
    }

    /**
     * Upload file to dropbox
     *
     * @param msgInfo
     * @param file_contents
     * @param file_location
     * @param userInfo
     * @returns {Promise}
     */
    uploadDropbox(resolveResults) {
        return new Promise((resolve, reject) => {
            // upload to dropbox
            this._DropboxHelper.uploadFile({
                    path: '/' + path.basename(resolveResults.file_location),
                    contents: resolveResults.file_contents
                },
                resolveResults.userInfo.provider_sites.dropbox
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
        return "upload_dropbox";
    }
}

