const Dropbox = require("dropbox");
const Logger = require("../../Helpers/Logger");

module.exports = class DropboxHelper {
    constructor(app) {
        this._app = app;
    }

    /**
     * Returns a dropbox client
     *
     * @param token
     */
    createClient(user_info = false) {
        // default options
        let DropboxOptions = {
            clientId: process.env.DROPBOX_APP_KEY
        };

        // add the access token
        if (user_info) {
            DropboxOptions.accessToken =
                user_info.provider_sites.dropbox.access_token;
        }

        // Create dropbox object
        return new Dropbox(DropboxOptions);
    }

    /**
     * Fetch all file for a specifc path
     *
     * @param path
     * @param user_info
     * @returns {Promise.<FilesListFolderResult, Error.<FilesListFolderError>>}
     */
    getFilesList(path, user_info) {
        // Create dropbox object
        var dbx = this.createClient(user_info);

        // return the promise
        return dbx.filesListFolder({ path: path });
    }

    /**
     * Search for files in folder
     *
     * @param google_tokens
     * @param newOptions
     * @returns {Promise}
     *
     * @see https://developers.google.com/drive/v3/web/search-parameters
     */
    async searchFile(user_info, file_name, advanced_options = {}) {
        // Create dropbox object
        const dbx = this.createClient(user_info);

        // options to use in upload
        var options = Object.assign(
            {
                path: "",
                query: file_name.trim(),
                start: 0,
                max_results: 25,
                mode: {
                    ".tag": "filename"
                }
            },
            advanced_options
        );

        // search for the files and return the result
        return await dbx.filesSearch(options).then(result => result.matches);
    }

    /**
     * Upload a file to dropbox
     *
     * @param newOptions
     * @param dropboxToken
     * @returns {Promise.<FilesFileMetadata, Error.<FilesUploadError>>}
     */
    uploadFile(newOptions, user_info) {
        // Create dropbox object
        const dbx = this.createClient(user_info);

        // options to use in upload
        var options = Object.assign(
            {
                // default options
                mode: {
                    ".tag": "add"
                },
                autorename: true,
                mute: false
            },
            newOptions
        );

        // return the promise
        return dbx.filesUpload(options);
    }

    /**
     * Get user account info for a token
     *
     * @param dropboxToken
     * @returns {*}
     */
    getUserInfo(user_info) {
        return new Promise((resolve, reject) => {
            // create a dropboxclient
            const dbx = this.createClient(user_info);

            // return the info promise
            dbx
                .usersGetCurrentAccount()
                .then(user_info => resolve(user_info))
                .catch(reject);
        });
    }

    /**
     * Create a file share link
     *
     * @param path
     * @param dropboxToken
     * @param short
     */
    createShareLink(user_info, path, short = false) {
        // create a dropboxclient
        const dbx = this.createClient(user_info);

        // return the share link
        return dbx.sharingCreateSharedLink({
            path: path,
            short_url: short
        });
    }
};
