const fs = require('fs');
const mime = require('mime');
const path = require('path');
const google = require('googleapis');
const winston = rootRequire('src/Helpers/Logger.js');
const OAuth2 = google.auth.OAuth2;

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
     * @param userInfo
     * @returns {Promise}
     */
    createOauthClient(userInfo) {
        return new Promise((resolve, reject) => {
            // create default oauth2 client
            const oauthclient = new OAuth2(
                process.env.GOOGLE_CLIENT_ID,
                process.env.GOOGLE_SECRET,
                process.env.WEBSITE_URL + process.env.GOOGLE_REDIRECT_URI
            );

            // check if user info is set, else just return the oauth2 client
            if (!userInfo) {
                // nothing more to do
                resolve(oauthclient);
            }

            // seperate correct tokens
            const tokens = userInfo.provider_sites.google;

            // check if oogle tokens found
            if (tokens) {
                // store the credentials
                oauthclient.setCredentials(tokens);

                // get a valid token
                this.getValidToken(oauthclient, userInfo._id)
                    .then(newTokens => {
                        // true means not new
                        if (newTokens === true) {
                            // tokens were still valid, resolve existing client
                            return resolve(oauthclient);
                        }

                        // copy the user and prepare to update
                        let newUser = userInfo;
                        newUser.provider_sites.google = newTokens;

                        // store new crednetials
                        oauthclient.setCredentials(newTokens);

                        // update the user
                        this._app._UserHelper.updateUserTokens(newUser)
                            .then(success => {
                                resolve(oauthclient);
                            }).catch(reject);
                    })
                    .catch(err => {
                        // failed to get valid tokens
                        // TODO remove tokens here?
                        reject(err);
                    })
            } else {
                reject("No token found for Google provider");
            }

        });
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
    searchFile(user, file_name, advanced_options = {}) {
        return new Promise((resolve, reject) => {
            // get a valid oauth client
            this.createOauthClient(user)
                .then(authclient => {
                    // drive object
                    var drive = google.drive({version: 'v3', auth: authclient});

                    // options to use in upload
                    var options = Object.assign({
                        q: "name contains '" + file_name + "'",
                        fields: "nextPageToken, files(id, name, mimeType, thumbnailLink, webViewLink, webContentLink, description)",
                        spaces: 'drive',
                        pageToken: null
                    }, advanced_options);

                    // load the files
                    drive.files.list(options, (err, res) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(res.files);
                        }
                    });
                })
                .catch(reject);
        });
    }

    /**
     * Upload a file
     *
     * @param userInfo
     * @param filePath
     * @param fileName
     * @param parent_folder_id
     * @returns {Promise.<FilesListFolderResult, Error.<FilesListFolderError>>}
     *
     * @see https://developers.google.com/drive/v3/web/manage-uploads
     */
    uploadFile(userInfo, filePath, fileName = false, parent_folder_id = false) {
        return new Promise((resolve, reject) => {
            // create a new ouath client
            this.createOauthClient(userInfo)
                .then(authclient => {
                    // drive object
                    let drive = google.drive({version: 'v3', auth: authclient});

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

                        // file resources
                        let fileResource = {
                            name: uploadFileName,
                            mimeType: mimeType
                        };

                        //check if a parent folder id was given
                        if (parent_folder_id) {
                            fileResource.parents = [];
                            fileResource.parents.push(parent_folder_id);
                        }

                        // create the file
                        drive.files.create({
                            resource: fileResource,
                            media: {
                                mimeType: mimeType,
                                body: data
                            }
                        }, (err, result) => {
                            resolve(result);
                        });
                    });
                })
        });
    }

    /**
     * Asserts that a uploadbro folder exists and returns the ID
     *
     * @param userInfo
     * @returns {Promise}
     *
     * @see https://developers.google.com/drive/v3/web/folder
     */
    assertUploadFolder(userInfo) {
        return new Promise((resolve, reject) => {
            // check if the folder exists with the name uploadbro
            this.searchFile(userInfo, 'UploadBro', {
                q: "name = 'UploadBro' and trashed = false and mimeType = 'application/vnd.google-apps.folder'"
            })
                .then(file_info => {
                    // should only return 1 result
                    if (file_info.length === 0) {
                        // no results so we need to create it
                        this.createFolder(userInfo, 'UploadBro')
                            .then(resolve)
                            .catch(reject);
                    } else if (file_info.length === 1) {
                        // return the folrder id
                        resolve(file_info[0]['id']);
                    } else {
                        reject('Failed to reliably fetch the UploadBro folder');
                    }
                })
                .catch(reject);
        });
    }

    createFolder(userInfo, folder_name) {
        return new Promise((resolve, reject) => {
            // create a new ouath client
            this.createOauthClient(userInfo)
                .then(authclient => {
                    // drive object
                    let drive = google.drive({version: 'v3', auth: authclient});

                    // create the file
                    drive.files.create({
                        resource: {
                            'name': 'UploadBro',
                            'mimeType': 'application/vnd.google-apps.folder'
                        },
                        fields: 'id'
                    }, (err, file) => {
                        if (err) return reject(err);
                        // resolve the file id
                        resolve(file.id);
                    });
                })
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
                fields: "nextPageToken, files(id, name, thumbnailLink, description)"
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
     * A url that redirects to a thumbnail
     *
     * @param fileId
     * @returns {string}
     */
    getThumbnailLink(fileId) {
        return 'https://drive.google.com/thumbnail?authuser=0&sz=w320&id=' + fileId;
    }

    /**
     * Automatically refresh accesstoken when required
     *
     * @param oauthClient
     * @param user_id
     * @returns {Promise}
     */
    getValidToken(oauthClient, user_id) {
        return new Promise((resolve, reject) => {
            if (oauthClient.credentials.access_token && this.hasNotExpired(oauthClient)) {
                // not expired
                resolve(true);
            } else {
                // get the access token, should get a new one if invalid
                oauthClient.getAccessToken((err, access_token, response) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(response.body);
                    }
                });
            }
        });
    }

    /**
     * Check if client tokens are expired
     * @param client
     * @returns {boolean}
     */
    hasNotExpired(client) {
        // get expiry date
        var expiryDate = client.credentials.expiry_date;
        if (expiryDate) {
            return expiryDate >= (new Date()).getTime()
        }
        return false;
    }
}