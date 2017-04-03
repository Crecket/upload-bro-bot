const fs = require('fs');
const path = require('path');
const axios = require('axios');
const BoxSDK = require('box-node-sdk');
const Logger = rootRequire('src/Helpers/Logger.js');

module.exports = class BoxHelper {
    constructor(app) {
        this._app = app;
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
        // no tokens found, just return the regular client
        if (user_info && !user_info.provider_sites.box) {
            return Promise.reject("Box tokens not set");
        }

        // set the token
        const tokens = this.getToken(user_info);

        // verify if we got tokens
        if (tokens) {
            // get a valid token set
            const {validTokens, isNew} = await this.getValidToken(tokens);

            if (isNew) {
                // update the tokens in database
            }

            // create a box sdk
            const sdk = this.getSdkClient();

            // create a client with the access token
            return sdk.getBasicClient(validTokens.accessToken);
        }
        // no tokens set, we can't continue
        throw new Error('No tokens set');
    }

    /**
     * @param user_info
     * @returns {*}
     */
    getToken(user_info) {
        return user_info.provider_sites.box ? user_info.provider_sites.box : false;
    }

    /**
     * Returns the url to be used in authorization request
     *
     * @returns {string}
     */
    getAuthorizationUrl() {
        return 'https://account.box.com/api/oauth2/authorize' +
            '?response_type=code' +
            '&client_id=' + process.env.BOX_CLIENT_ID +
            '&redirect_uri=' + process.env.WEBSITE_URL + process.env.BOX_REDIRECT_URI +
            "&state=" + ((new Date()).getTime());
    }

    /**
     * Do authorization request for the given code
     *
     * @param code
     * @returns {Promise}
     */
    requestAccessToken(code) {
        return new Promise((resolve, reject) => {
            // create a new ouath client
            const sdk = this.getSdkClient();

            // get access token for code
            sdk.getTokensAuthorizationCodeGrant(code, null,
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
        return await new Promise((resolve, reject) => {
            // create new sdk client
            const sdk = this.getSdkClient();

            // attempt to refresh tokens using refresh token
            sdk.getTokensRefreshGrant(tokens.refreshToken, function (err, tokenInfo) {
                if (err) {
                    Logger.error(err);
                    return reject(err);
                }

                Logger.debug(tokenInfo);
                resolve(tokenInfo);
            });
        });
    }

    /**
     * validate tokens and get new ones if they are not
     *
     * @param tokens
     * @returns {Promise}
     */
    async getValidToken(tokens) {
        return await new Promise((resolve, reject) => {
            // check if access token has expired
            if (tokens.expiry_date - (new Date()).getTime() >= 0) {
                // not expired, no new tokens
                resolve({validTokens: tokens});
            } else {
                // attempt to get  new tokens
                this.refreshAccessToken(tokens)
                    .then(newTokens => resolve({
                        validTokens: newTokens,
                        isNew: true
                    }))
                    .catch(reject);
            }
        });
    }

    /**
     * Upload a file
     *
     * @param userInfo
     * @param filePath
     * @returns {Promise}
     */
    uploadFile(userInfo, filePath, fileName = false) {
        return new Promise((resolve, reject) => {
            // create a new ouath client
            this.createOauthClient(userInfo)
                .then(imgurClient => {

                    // get the contents
                    fs.readFile(filePath, {}, (err, data) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        // A single image
                        imgurClient.uploadFile(filePath)
                            .then((json) => resolve(json.data))
                            .catch(reject);
                    });
                }).catch(reject);
        });
    }

}
