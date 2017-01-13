var Dropbox = require('dropbox');

module.exports = class DropboxHandler {
    constructor(db, bot) {
        this._db = db;
        this._bot = bot

        // Create dropbox object
        this._DropbBox = new Dropbox({accessToken: process.env.DROPBOX_API_TEST_TOKEN});
    }

    /**
     * Fetch all file for a specifc path
     * @param path
     * @returns {Promise.<FilesListFolderResult, Error.<FilesListFolderError>>}
     */
    getFilesList(path = '') {
        return this._DropbBox.filesListFolder({path: path});
    }

}