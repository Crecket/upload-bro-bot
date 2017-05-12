const fs = require("fs");
const mime = require("mime");
const path = require("path");
const google = require("googleapis");
const Logger = require("../../Helpers/Logger");
const OAuth2 = google.auth.OAuth2;

module.exports = class FlickrHelper {
    constructor(app) {
        this._app = app;
    }

    /**
     * Create a oauth client object
     *
     * @param userInfo
     * @returns {Promise}
     */
    async createOauthClient(userInfo) {
        // create default oauth2 client
        const oauthclient = new OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_SECRET,
            process.env.WEBSITE_URL + process.env.GOOGLE_REDIRECT_URI
        );

        // check if user info is set, else just return the oauth2 client
        if (!userInfo) {
            // nothing more to do
            return Promise.resolve(oauthclient);
        }

        // seperate correct tokens
        const tokens = userInfo.provider_sites.google;

        // check if oogle tokens found
        if (tokens) {
            // store the initial credentials
            oauthclient.setCredentials(tokens);

            // get a valid token
            const newTokens = await this.getValidToken(
                oauthclient,
                userInfo._id
            );

            // true means not new
            if (newTokens === true) {
                // tokens were still valid, resolve existing client
                return Promise.resolve(oauthclient);
            }

            // copy the user and prepare to update
            let newUser = userInfo;
            newUser.provider_sites.google = Object.assign(
                {},
                newUser.provider_sites.google,
                newTokens
            );

            // store new crednetials
            oauthclient.setCredentials(newTokens);

            // update the user
            const success = await this._app._UserHelper.updateUserTokens(
                newUser
            );
            if (success) return oauthclient;
            // new token failed to store
            throw new Error("Failed to store new access tokens");
        }
        throw new Error("No token found for Flickr provider");
    }

    /**
     * Search for files in folder
     *
     * @param flickr_tokens
     * @param newOptions
     * @returns {Promise}
     *
     * @see https://developers.flickr.com/drive/v3/web/search-parameters
     */
    async searchFile(user, file_name, advanced_options = {}) {
        // get a valid oauth client
        const authclient = await this.createOauthClient(user);

        // drive object
        var drive = flickr.drive({ version: "v3", auth: authclient });

        // escape special character
        file_name = file_name.replace(/[\\'"/]/g, " ");

        // options to use in upload
        var options = Object.assign(
            {
                q: `name contains '${file_name}' and trashed=false`,
                fields: "nextPageToken, files(id, name, mimeType, thumbnailLink, webViewLink, webContentLink, description)",
                spaces: "drive",
                pageToken: null,
                pageSize: 25
            },
            advanced_options
        );

        return new Promise((resolve, reject) => {
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
     * @param userInfo
     * @param filePath
     * @param fileName
     * @param parent_folder_id
     * @returns {Promise.<FilesListFolderResult, Error.<FilesListFolderError>>}
     *
     * @see https://developers.flickr.com/drive/v3/web/manage-uploads
     */
    async uploadFile(
        userInfo,
        filePath,
        fileName = false,
        parent_folder_id = false
    ) {
        // get a valid oauth client
        const authclient = await this.createOauthClient(userInfo);

        // drive object
        let drive = flickr.drive({ version: "v3", auth: authclient });

        // promise to wrap the callback functions
        return new Promise((resolve, reject) => {
            // get the contents
            fs.readFile(filePath, {}, (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }

                // get the file mimetype
                var mimeType = mime.lookup(filePath);

                // what file name to use
                var uploadFileName = fileName
                    ? fileName
                    : path.basename(filePath);

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
                drive.files.create(
                    {
                        resource: fileResource,
                        media: {
                            mimeType: mimeType,
                            body: data
                        }
                    },
                    (err, result) => {
                        resolve(result);
                    }
                );
            });
        });
    }

    /**
     * Asserts that a uploadbro folder exists and returns the ID
     *
     * @param userInfo
     * @returns {Promise}
     *
     * @see https://developers.flickr.com/drive/v3/web/folder
     */
    async assertUploadFolder(userInfo) {
        return await new Promise((resolve, reject) => {
            // check if the folder exists with the name uploadbro
            this.searchFile(userInfo, "UploadBro", {
                q: "name = 'UploadBro' and trashed = false and mimeType = 'application/vnd.flickr-apps.folder'"
            })
                .then(file_info => {
                    // should only return 1 result
                    if (file_info.length === 0) {
                        // no results so we need to create it
                        this.createFolder(userInfo, "UploadBro")
                            .then(resolve)
                            .catch(reject);
                    } else if (file_info.length === 1) {
                        // return the folrder id
                        resolve(file_info[0]["id"]);
                    } else {
                        reject("Failed to reliably fetch the UploadBro folder");
                    }
                })
                .catch(reject);
        });
    }

    /**
     * Create a new folder on a specific location
     *
     * @param userInfo
     * @param folder_name
     * @returns {Promise}
     */
    async createFolder(userInfo, folder_name) {
        // create a new ouath client
        const authClient = await this.createOauthClient(userInfo);

        // drive object
        let drive = flickr.drive({ version: "v3", auth: authClient });

        return new Promise((resolve, reject) => {
            // create the file
            drive.files.create(
                {
                    resource: {
                        name: "UploadBro",
                        mimeType: "application/vnd.flickr-apps.folder"
                    },
                    fields: "id"
                },
                (err, file) => {
                    if (err) return reject(err);
                    // resolve the file id
                    resolve(file.id);
                }
            );
        });
    }

    /**
     * download a file
     *
     * @param flickr_tokens
     * @param fileId
     * @param filePath
     * @returns {Promise.<FilesListFolderResult, Error.<FilesListFolderError>>}
     *
     * @see https://developers.flickr.com/drive/v3/web/manage-downloads
     */
    async downloadFile(flickr_tokens, fileId, filePath) {
        // create new auth client
        var authclient = await this.createOauthClient(flickr_tokens);

        // drive object
        var drive = flickr.drive({ version: "v3", auth: authclient });

        // get the file mimetype
        var mimeType = mime.lookup(filePath);

        // create target stream
        var dest = fs.createWriteStream(filePath);

        return await new Promise((resolve, reject) => {
            // start export
            drive.files
                .get({
                    fileId: fileId,
                    mimeType: mimeType,
                    alt: "media"
                })
                .on("end", () => {
                    resolve(true);
                })
                .on("error", err => {
                    reject(err);
                })
                .pipe(dest);
        });
    }

    /**
     * get info about oauth client's user
     *
     * @param user_info
     * @returns {Promise}
     */
    async userInfo(user_info) {
        const authclient = await this.createOauthClient(user_info);

        // drive object
        var drive = flickr.drive({ version: "v3", auth: authclient });

        // start export
        return new Promise((resolve, reject) => {
            drive.about.get(
                {
                    fields: "user"
                },
                (err, userInformation) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(userInformation);
                    }
                }
            );
        });
    }

    // /**
    //  * get file info
    //  *
    //  * @param flickr_tokens
    //  * @param fileId
    //  * @returns {Promise.<FilesListFolderResult, Error.<FilesListFolderError>>}
    //  *
    //  * @see https://developers.flickr.com/drive/v3/web/manage-downloads
    //  */
    // fileInfo(flickr_tokens, fileId) {
    //     return new Promise((resolve, reject) => {
    //         var authclient = this.createOauthClient(flickr_tokens)
    //
    //         // drive object
    //         var drive = flickr.drive({version: 'v3', auth: authclient});
    //
    //         // start export
    //         drive.files.get({
    //             fileId: fileId
    //         }, (err, buffer) => {
    //             if (err) {
    //                 reject(err);
    //             } else {
    //                 resolve(buffer);
    //             }
    //         });
    //     });
    // }
    //
    // /**
    //  * get files list
    //  *
    //  * @param file
    //  * @param newOptions
    //  * @param dropboxToken
    //  * @returns {Promise.<FilesFileMetadata, Error.<FilesUploadError>>}
    //  *
    //  * @see
    //  */
    // getFilesList(flickr_tokens, path = "") {
    //     return new Promise((resolve, reject) => {
    //         var authclient = this.createOauthClient(flickr_tokens)
    //         var drive = flickr.drive({version: 'v3', auth: authclient});
    //
    //         drive.files.list({
    //             auth: authclient,
    //             pageSize: 10,
    //             fields: "nextPageToken, files(id, name, thumbnailLink, description)"
    //         }, (err, response) => {
    //             if (err) {
    //                 reject(err);
    //             } else {
    //                 resolve(response.files);
    //             }
    //         });
    //     })
    // }

    /**
     * Creates a shareable link
     *
     * @param fileId
     * @returns {string}
     */
    getShareableLink(fileId) {
        return "https://drive.flickr.com/open?id=" + fileId;
    }

    /**
     * A url that redirects to a thumbnail
     *
     * @param fileId
     * @returns {string}
     */
    getThumbnailLink(fileId) {
        return (
            "https://drive.flickr.com/thumbnail?authuser=0&sz=w320&id=" + fileId
        );
    }

    /**
     * Automatically refresh accesstoken when required
     *
     * @param oauthClient
     * @param user_id
     * @returns {Promise}
     */
    async getValidToken(oauthClient, user_id) {
        return await new Promise((resolve, reject) => {
            if (
                oauthClient.credentials.access_token &&
                this.hasNotExpired(oauthClient)
            ) {
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
            return expiryDate >= new Date().getTime();
        }
        return false;
    }
};
