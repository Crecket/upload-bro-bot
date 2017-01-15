var Dropbox = require('dropbox');

module.exports = class DropboxHelper {
    constructor(app) {
        this._app = app;
    }

    /**
     * Returns a dropbox client
     *
     * @param token
     */
    createClient(token) {
        // Create dropbox object
        return new Dropbox({
            clientId: process.env.DROPBOX_APP_KEY,
            accessToken: token
        });
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
        var dbx = this.createClient(dropboxToken);

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
        var dbx = this.createClient(dropboxToken);

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

    sharingCreateSharedLink(){
        // share a file
        // http://dropbox.github.io/dropbox-sdk-js/Dropbox.html#sharingCreateSharedLink__anchor
    }

}