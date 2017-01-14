var fs = require('fs');
var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;

module.exports = class DropboxHandler {
    constructor(app) {
        this._app = app;
    }

    /**
     * Create a oauth client object
     *
     * @param tokens
     * @returns {google.auth.OAuth2}
     */
    createOauthClient(tokens) {
        var oauthclient = new OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_SECRET,
            process.env.GOOGLE_REDIRECT_URI
        );
        if (tokens) {
            oauthclient.setCredentials(tokens);
        }
        return oauthclient;
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
    searchFile(google_tokens, newOptions) {
        return new Promise((resolve, reject) =>{
            var authclient = this.createOauthClient(google_tokens)

            // drive object
            var drive = google.drive({version: 'v3', auth: authclient});

            // options to use in upload
            var options = Object.assign({
                q: "mimeType='image/jpeg'",
                fields: 'nextPageToken, files(id, name)',
                spaces: 'drive',
                pageToken: null
            }, newOptions);

            // load the files
            drive.files.list(options, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res.files);
                }
            });
        });
    }

    /**
     * Upload a file
     *
     * @param google_tokens
     * @param resource
     * @param media
     * @returns {Promise.<FilesListFolderResult, Error.<FilesListFolderError>>}
     *
     * @see https://developers.google.com/drive/v3/web/manage-uploads
     */
    uploadFile(google_tokens, resource = {
        name: 'topkekfile.txt',
        mimeType: 'text/plain'
    }, media = {
        mimeType: 'text/plain',
        body: 'Hello World'
    }) {
        return new Promise((resolve, reject) => {
            var authclient = this.createOauthClient(google_tokens)

            // drive object
            var drive = google.drive({version: 'v3', auth: authclient});

            // create the file
            drive.files.create({
                resource: resource,
                media: media
            }, (err, result) => {
                resolve(result);
            });
        });
    }

    /**
     * download a file
     *
     * @param google_tokens
     * @param fileId
     * @param target
     * @param mimeType
     * @returns {Promise.<FilesListFolderResult, Error.<FilesListFolderError>>}
     *
     * @see https://developers.google.com/drive/v3/web/manage-downloads
     */
    downloadFile(google_tokens, fileId, target, mimeType) {
        return new Promise((resolve, reject) => {
            var authclient = this.createOauthClient(google_tokens)

            // drive object
            var drive = google.drive({version: 'v3', auth: authclient});

            // create target stream
            var dest = fs.createWriteStream(target);

            // start export
            drive.files.export({
                fileId: fileId,
                mimeType: mimeType
            }).on('end', function () {
                console.log('Done');
                resolve(true);
            }).on('error', function (err) {
                console.log('Error during download', err);
                reject(err);
            }).pipe(dest);
        });
    }

    /**
     * get files list
     *
     * @param file
     * @param newOptions
     * @param dropboxToken
     * @returns {Promise.<FilesFileMetadata, Error.<FilesUploadError>>}
     *
     * @see
     */
    getFilesList(google_tokens, path = "") {
        return new Promise((resolve, reject) => {
            var authclient = this.createOauthClient(google_tokens)

            var drive = google.drive({version: 'v3', auth: authclient});

            drive.files.list({
                auth: authclient,
                pageSize: 10,
                fields: "nextPageToken, files(id, name)"
            }, function (err, response) {
                if (err) {
                    console.log('The API returned an error: ' + err);
                    return reject(err);
                }
                resolve(response.files);
            });
        })
    }

}