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
        // TODO auto verify token
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
    getFilesList(path, dropboxToken) {
        // Create dropbox object
        var dbx = this.createClient(dropboxToken);

        // return the promise
        return dbx.filesListFolder({path: path});
    }

    /**
     * Upload a file to dropbox
     *
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

        // return the promise
        return dbx.filesUpload(options);
    }

    /**
     * Get user account info for a token
     *
     * @param dropboxToken
     * @returns {*}
     */
    getUserInfo(dropboxToken) {
        // create a dropboxclient
        var client = this.createClient(dropboxToken);

        // return the info promise
        return client.usersGetCurrentAccount();
    }

    /**
     * Create a file share link
     *
     * @param path
     * @param dropboxToken
     * @param short
     */
    createShareLink(path, dropboxToken, short = false) {
        // create a dropboxclient
        var client = this.createClient(dropboxToken);

        // return the share link
        return client.sharingCreateSharedLink({
            path: path,
            short_url: short
        })
    }

}