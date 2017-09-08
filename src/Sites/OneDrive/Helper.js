const fs = require("fs");
const mime = require("mime");
const path = require("path");
const Logger = require("../../Helpers/Logger");
const OAuth2Client = require("./OAuth2Client");

// https://dev.onedrive.com/auth/graph_oauth.htm

module.exports = class OneDriveHelper {
    constructor(UploadBro) {
        this._UploadBro = UploadBro;
    }

    /**
     * Create a oauth client object
     *
     * @param userInfo
     * @returns {Promise}
     */
    async createOauthClient(userInfo) {
        const Client = new OAuth2Client();

        // check if user info is set, else just return the oauth2 client
        if (!userInfo) {
            // nothing more to do
            return Promise.resolve(Client);
        }

        // seperate correct tokens
        const tokens = userInfo.provider_sites.onedrive;

        // check if oogle tokens found
        if (tokens) {
            // store the initial credentials and create a new client
            Client.setCredentials(tokens);

            // get a valid token
            const newTokens = await Client.getValid(userInfo._id);

            if (newTokens === true) {
                // tokens were still valid, resolve existing client
                return Promise.resolve(Client);
            }
            if (newTokens === false) {
                // no valid access or refresh token
                throw new Error(
                    "We don't have any valid tokens stored for this user"
                );
            }

            // copy the user and prepare to update
            let newUser = userInfo;
            newUser.provider_sites.onedrive = {
                ...newUser.provider_sites.onedrive,
                ...newTokens
            };

            // store new crednetials
            Client.setCredentials(newTokens);

            // update the user
            const success = await this._UploadBro._UserHelper.updateUserTokens(
                newUser
            );
            if (success) return Client;
            // new token failed to store
            throw new Error("Failed to store new access tokens");
        }
        throw new Error("No token found for OneDrive provider");
    }

    /**
     * Search for files in folder
     *
     * @param onedrive_tokens
     * @param newOptions
     * @returns {Promise}
     *
     * @see https://developers.onedrive.com/drive/v3/web/search-parameters
     */
    async searchFile(user, file_name, advanced_options = {}) {
        // get a valid oauth client
        const authclient = await this.createOauthClient(user);

        // drive object
        var drive = onedrive.drive({ version: "v3", auth: authclient });

        // escape special character
        file_name = file_name.replace(/[\\'"/]/g, " ");

        // options to use in upload
        var options = Object.assign(
            {
                q: `name contains '${file_name}' and trashed=false`,
                fields:
                    "nextPageToken, files(id, name, mimeType, thumbnailLink, webViewLink, webContentLink, description)",
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
     * @see https://developers.onedrive.com/drive/v3/web/manage-uploads
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
        let drive = onedrive.drive({ version: "v3", auth: authclient });

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
     * @see https://developers.onedrive.com/drive/v3/web/folder
     */
    async assertUploadFolder(userInfo) {
        //
    }

    /**
     * Create a new folder on a specific location
     *
     * @param userInfo
     * @param folder_name
     * @returns {Promise}
     */
    async createFolder(userInfo, folder_name) {
        //
    }

    /**
     * download a file
     *
     * @param onedrive_tokens
     * @param fileId
     * @param filePath
     * @returns {Promise.<FilesListFolderResult, Error.<FilesListFolderError>>}
     *
     * @see https://developers.onedrive.com/drive/v3/web/manage-downloads
     */
    async downloadFile(onedrive_tokens, fileId, filePath) {
        //
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
        var drive = onedrive.drive({ version: "v3", auth: authclient });

        // start export
        return new Promise((resolve, reject) => {
            // do request to: https://api.onedrive.com/v1.0/drive
        });
    }

    /**
     * Get the authorization request url
     *
     * @returns {string}
     */
    getAuthorizationUrl() {
        const scope = "files.readwrite.all offline_access";
        return `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${process
            .env.ONEDRIVE_CLIENT_ID}&scope=${scope}
&response_type=code&redirect_uri=${process.env.WEBSITE_URL}${process.env
            .ONEDRIVE_REDIRECT_URI}`;
    }

    /**
     * Creates a shareable link
     *
     * @param fileId
     * @returns {string}
     */
    getShareableLink(fileId) {
        return "https://drive.onedrive.com/open?id=" + fileId;
    }

    /**
     * A url that redirects to a thumbnail
     *
     * @param fileId
     * @returns {string}
     */
    getThumbnailLink(fileId) {
        return (
            "https://drive.onedrive.com/thumbnail?authuser=0&sz=w320&id=" +
            fileId
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
