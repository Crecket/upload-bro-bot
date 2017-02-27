const fs = require('fs');
const path = require('path');
const appRoot = require('app-root-path');
const requireFix = appRoot.require;

const HelperInterface = requireFix('/src/HelperInterface');

module.exports = class UploadFinish extends HelperInterface {
    constructor(app) {
        super(app);

        this._app = app;
    }

    /**
     * The generic end steps that most upload queries will do
     *
     * @param query
     * @returns {Promise}
     */
    handle(resolveResults) {
        // console.log(query);
        return new Promise((resolve, reject) => {
            // show finished message with the final URL
            this.editMessage("\u{2705} Finished uploading!", {
                chat_id: resolveResults.msgInfo.chat_id,
                message_id: resolveResults.msgInfo.message_id
            })
                .then(() => {
                    // remove the file
                    this.removeOldFile(resolveResults.file_location)
                        .then(resolve)
                        .catch(reject);

                    // finish queue item
                    this._app._Queue.finish(resolveResults.queueKey);
                })
                .catch(reject);
        });
    }

    /**
     * Remove the file after upload
     *
     * @param file_location
     * @returns {Promise}
     */
    removeOldFile(file_location) {
        return new Promise((resolve, reject) => {
            // attempt to remove file
            fs.unlink(file_location, (err) => {
                // not important if it fails
            })

            resolve();
        })
    }
}

