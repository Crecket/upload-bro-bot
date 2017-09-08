const fs = require("fs");
const path = require("path");
const axios = require("axios");
const BoxSDK = require("box-node-sdk");
const Logger = require("../../Helpers/Logger");
const a = require("awaiting");

module.exports = class BoxHelper {
    constructor(app) {
        this._UploadBro = app;
    }

    /**
     * Create sdk client for box using our client id and secret
     *
     * @returns {BoxSDKNode}
     */
    getSdkClient() {
        // create a new box sdk
        return new BoxSDK({
            clientID: process.env.BOX_CLIENT_ID,
            clientSecret: process.env.BOX_CLIENT_SECRET
        });
    }

    /**
     * gets a imgur object with the given keys set for the user
     *
     * @param user
     * @returns {*}
     */
    async createOauthClient(user_info = false) {
        try {
            // no tokens found, just return the regular client
            if (user_info && !user_info.provider_sites.box) {
                return Promise.reject("Box tokens not set");
            }

            // verify the tokens
            const tokens = this.getToken(user_info);
            if (!tokens) {
                // no tokens set, we can't continue
                throw new Error("No tokens set");
            }

            // get a valid token set
            let { validTokens, isNew } = await this.getValidToken(user_info);

            if (isNew) {
                // copy the user and prepare to update
                let newUser = {};
                newUser.provider_sites = {};
                // merge existing with new
                newUser.provider_sites.box = Object.assign(
                    {},
                    user_info.provider_sites.box,
                    validTokens
                );

                // update the user
                const success = await this._UploadBro._UserHelper.updateUserTokens(
                    newUser
                );
                if (success === false) {
                    // no tokens set, we can't continue
                    throw new Error("Failed to store refreshed tokens");
                }
            }

            // create a box sdk
            const sdk = this.getSdkClient();

            // create a client with the access token
            return sdk.getBasicClient(validTokens.accessToken);
        } catch (ex) {
            // reject/rethrow the original error
            return Promise.reject(ex);
        }
    }

    /**
     * @param user_info
     * @returns {*}
     */
    getToken(user_info) {
        return user_info.provider_sites.box
            ? user_info.provider_sites.box
            : false;
    }

    /**
     * Returns the url to be used in authorization request
     *
     * @returns {string}
     */
    getAuthorizationUrl() {
        return (
            "https://account.box.com/api/oauth2/authorize" +
            "?response_type=code" +
            `&client_id=${process.env.BOX_CLIENT_ID}` +
            `&redirect_uri=${process.env.WEBSITE_URL}${process.env
                .BOX_REDIRECT_URI}` +
            `&state=${new Date().getTime()}`
        );
    }

    /**
     * Do authorization request for the given code
     *
     * @param code
     * @returns {Promise}
     */
    async requestAccessToken(code) {
        return new Promise((resolve, reject) => {
            // create a new ouath client
            const sdk = this.getSdkClient();

            // get access token for code
            sdk.getTokensAuthorizationCodeGrant(
                code,
                null,
                (err, tokenInfo) => {
                    if (err) {
                        Logger.error(err);
                        reject(err);
                    } else {
                        resolve(tokenInfo);
                    }
                }
            );
        });
    }

    /**
     * get a new access token using refresh token
     *
     * @param tokens
     * @returns {*}
     */
    async refreshAccessToken(tokens) {
        return new Promise((resolve, reject) => {
            // create new sdk client
            const sdk = this.getSdkClient();

            // attempt to refresh tokens using refresh token
            sdk.getTokensRefreshGrant(tokens.refreshToken, (err, tokenInfo) => {
                if (err) return reject(err);

                // set the expiry date
                tokenInfo.expiry_date =
                    new Date().getTime() + tokenInfo.accessTokenTTLMS;

                // return the tokens
                resolve(tokenInfo);
            });
        });
    }

    /**
     * validate tokens and get new ones if they are not
     *
     * @param user_info
     * @returns {Promise}
     */
    async getValidToken(user_info) {
        try {
            const tokens = this.getToken(user_info);

            // check if access token has expired
            if (tokens.expiry_date - new Date().getTime() >= 0) {
                // not expired, no new tokens
                return { validTokens: tokens };
            } else {
                // attempt to get  new tokens and return them
                return {
                    validTokens: await this.refreshAccessToken(tokens),
                    isNew: true
                };
            }
        } catch (error) {
            if (
                error.response &&
                error.response.body &&
                error.response.body.error === "invalid_grant"
            ) {
                // refresh token has expired, require the user to login again
                return Promise.reject({
                    custom_error: "remove_account",
                    custom_error_options: {
                        site: "box"
                    },
                    error: error
                });
            }
            // fallback to default error
            return Promise.reject(error);
        }
    }

    /**
     * Upload a file
     *
     * @param userInfo
     * @param filePath
     * @param parentFoldId
     * @returns {Promise}
     */
    async uploadFile(userInfo, filePath, parentFoldId = "0") {
        try {
            // create a new ouath client
            const oauthCllient = await this.createOauthClient(userInfo);

            // await callbacks
            const data = await a.callback(fs.readFile, filePath);

            const file = await new Promise((resolve, reject) => {
                // upload file using oauth client
                oauthCllient.files.uploadFile(
                    parentFoldId,
                    path.basename(filePath),
                    data,
                    (err, file) => {
                        if (!err) return resolve(file);
                        reject(err);
                    }
                );
            });
            return file;
        } catch (ex) {
            return Promise.reject(ex);
        }
    }

    /**
     * Search for files
     *
     * @param userInfo
     * @param searchQuery
     * @param options
     * @returns {Promise}
     */
    async searchFile(userInfo, searchQuery, options = {}) {
        // merge given options with defaults
        const parsedOptions = {
            fields: "name,modified_at,size,extension,shared_link",
            // file_extensions: "pdf,doc",
            limit: 20,
            type: "file",
            offset: 0,
            ...options
        };
        return await new Promise((resolve, reject) => {
            // create a new ouath client
            this.createOauthClient(userInfo)
                .then(oauthCllient => {
                    // search for given query
                    oauthCllient.search.query(
                        searchQuery,
                        parsedOptions,
                        (err, results) => {
                            if (!err) return resolve(results);
                            reject(err);
                        }
                    );
                })
                .catch(reject);
        });
    }
};
