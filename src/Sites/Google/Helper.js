var fs = require('fs');
var mime = require('mime');
var path = require('path');
var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;

// https://developers.google.com/apis-explorer/#search/drive/
// https://developers.google.com/drive/v3/web/about-sdk
// https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=

module.exports = class GoogleHelper {
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
        return new Promise((resolve, reject) => {
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
     * @param filePath
     * @returns {Promise.<FilesListFolderResult, Error.<FilesListFolderError>>}
     *
     * @see https://developers.google.com/drive/v3/web/manage-uploads
     */
    uploadFile(google_tokens, filePath, fileName = false) {
        return new Promise((resolve, reject) => {
            var authclient = this.createOauthClient(google_tokens)

            // drive object
            var drive = google.drive({version: 'v3', auth: authclient});

            // get the contents
            fs.readFile(filePath, {}, (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }

                // get the file mimetype
                var mimeType = mime.lookup(filePath);

                // what file name to use
                var uploadFileName = fileName ? fileName : path.basename(filePath);

                // create the file
                drive.files.create({
                    resource: {
                        name: uploadFileName,
                        mimeType: mimeType
                    },
                    media: {
                        mimeType: mimeType,
                        body: data
                    }
                }, (err, result) => {
                    resolve(result);
                });
            });
        });
    }

    /**
     * download a file
     *
     * @param google_tokens
     * @param fileId
     * @param filePath
     * @returns {Promise.<FilesListFolderResult, Error.<FilesListFolderError>>}
     *
     * @see https://developers.google.com/drive/v3/web/manage-downloads
     */
    downloadFile(google_tokens, fileId, filePath) {
        return new Promise((resolve, reject) => {
            var authclient = this.createOauthClient(google_tokens)

            // drive object
            var drive = google.drive({version: 'v3', auth: authclient});

            // get the file mimetype
            var mimeType = mime.lookup(filePath);

            // create target stream
            var dest = fs.createWriteStream(filePath);

            // start export
            drive.files.get({
                fileId: fileId,
                mimeType: mimeType,
                alt: "media"
            }).on('end', () => {
                resolve(true);
            }).on('error', (err) => {
                reject(err);
            }).pipe(dest);
        });
    }

    /**
     * get file info
     *
     * @param google_tokens
     * @param fileId
     * @returns {Promise.<FilesListFolderResult, Error.<FilesListFolderError>>}
     *
     * @see https://developers.google.com/drive/v3/web/manage-downloads
     */
    fileInfo(google_tokens, fileId) {
        return new Promise((resolve, reject) => {
            var authclient = this.createOauthClient(google_tokens)

            // drive object
            var drive = google.drive({version: 'v3', auth: authclient});

            // start export
            drive.files.get({
                fileId: fileId
            }, (err, buffer) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(buffer);
                }
            });
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
            }, (err, response) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(response.files);
                }
            });
        })
    }

    /**
     * Creates a shareable link
     *
     * @param fileId
     * @returns {string}
     */
    getShareableLink(fileId) {
        return 'https://drive.google.com/open?id=' + fileId;
    }

    /**
     * Automatically refresh accesstoken when required
     *
     * @param oauthClient
     * @param user_id
     * @returns {Promise}
     */
    getAccessToken(oauthClient, user_id) {
        return new Promise((resolve, reject) => {
            oauthClient.getAccessToken((err, access_token, response) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({
                        newTokens: response ? response.body : false,
                        access_token: access_token
                    });
                }
            });
        });
    }

    /**
     * Check if client tokens are expired
     * @param client
     * @returns {boolean}
     */
    isExpired(client) {
        // get expiry date
        var expiryDate = client.credentials.expiry_date;
        // if no expiry time, assume it's not expired
        return expiryDate ? expiryDate <= (new Date()).getTime() : false;
    }
}