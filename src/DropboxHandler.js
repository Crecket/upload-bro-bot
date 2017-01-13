var Dropbox = require('dropbox');

module.exports = class DropboxHandler {
    constructor(db, bot) {
        this._db = db;
        this._bot = bot
    }

    /**
     * Fetch all file for a specifc path
     *
     * @param path
     * @param token
     * @returns {Promise.<FilesListFolderResult, Error.<FilesListFolderError>>}
     */
    getFilesList(path = '', dropboxToken = false) {
        // get token or use my test token
        var token = (dropboxToken) ? dropboxToken : process.env.DROPBOX_API_TEST_TOKEN;

        // Create dropbox object
        var dbx = new Dropbox({accessToken: token});

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
    uploadFile(newOptions, dropboxToken = false) {
        // get token or use my test token
        var token = (dropboxToken) ? dropboxToken : process.env.DROPBOX_API_TEST_TOKEN;

        // Create dropbox object
        var dbx = new Dropbox({accessToken: token});

        // options to use in upload
        var options = Object.assign({
            // default options
            mode: {
                ".tag": "add"
            },
            autorename: true,
            mute: false,
        }, newOptions);

        // console.log(options);

        // return Promise.resolve('nop');

        return dbx.filesUpload(options);
    }

}