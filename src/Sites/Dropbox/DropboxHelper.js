var Dropbox = require('dropbox');

module.exports = class DropboxHandler {
    constructor(app) {
        this._app = app;
    }

    /**
     * Fetch all file for a specifc path
     *
     * @param path
     * @param token
     * @returns {Promise.<FilesListFolderResult, Error.<FilesListFolderError>>}
     */
    getFilesList(path = '', dropboxToken) {
        // Create dropbox object
        var dbx = new Dropbox({accessToken: dropboxToken});

        // return the promise
        return dbx.filesListFolder({path: path});
    }

    /**
     * Upload a file
     *
     * @param file
     * @param newOptions
     * @param dropboxToken
     * @returns {Promise.<FilesFileMetadata, Error.<FilesUploadError>>}
     */
    uploadFile(newOptions, dropboxToken) {
        // Create dropbox object
        var dbx = new Dropbox({accessToken: dropboxToken});

        // options to use in upload
        var options = Object.assign({
            // default options
            mode: {
                ".tag": "add"
            },
            autorename: true,
            mute: false,
        }, newOptions);

        return dbx.filesUpload(options);
    }

}