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
     * gets a imgur object with the given keys set for the user
     *
     * @param user
     * @returns {*}
     */
    createOauthClient(user = false) {
        // no tokens found, just return the regular client
        if (user) {
            if (!user.provider_sites.box) {
                return Promise.reject("Box tokens not set");
            }
            // set the token
            const tokens = user.provider_sites.box;
        }

        return new Promise((resolve, reject) => {
            // create a new box sdk
            const sdk = new BoxSDK({
                clientID: process.env.BOX_CLIENT_ID,
                clientSecret: process.env.BOX_CLIENT_SECRET
            });

            resolve(sdk);
        });

        // check if tokens are valid
        return new Promise((resolve, reject) => {
            // validate the token
            this.getValidToken(tokens)
                .then(newTokens => {
                    // check if new tokens === true or if new one have been fetched
                    if (newTokens !== true) {
                        // store the token new token in Imgur obj
                        Imgur.setAccessToken(newTokens.access_token);

                        // copy the user and prepare to update
                        let newUser = user;
                        newUser.provider_sites.imgur = newTokens;

                        // update the user
                        this._app._UserHelper.updateUserTokens(newUser)
                            .then(success => {
                                resolve(Imgur);
                            }).catch(reject);
                    } else {
                        // use old tokens, no new tokens have been used
                        Imgur.setAccessToken(tokens.access_token);
                        resolve(Imgur);
                    }
                }).catch(reject);
        })
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
            this.createOauthClient()
                .then(BoxSDK => {
                    // get the token
                    BoxSDK.getTokensAuthorizationCodeGrant(code, null, (err, tokenInfo) => {
                        if (err) {
                            Logger.error(err);
                            reject(err);
                        } else {
                            Logger.debug(tokenInfo);
                            resolve(tokenInfo);
                        }
                    });
                }).catch(reject);

        });
    }

    /**
     * get a new access token using refresh token
     *
     * @param tokens
     * @returns {*}
     */
    refreshAccessToken(tokens) {
        return new Promise((resolve, reject) => {
            // do api call with the refresh token to fetch a new access token
            axios.post("https://api.imgur.com/oauth2/token", {
                refresh_token: tokens.refresh_token,
                client_id: process.env.IMGUR_CLIENT_ID,
                client_secret: process.env.IMGUR_CLIENT_SECRET,
                grant_type: 'refresh_token'
            }).then(result => {
                let resultData = result.data;

                // return the new list
                resolve(Object.assign(resultData, {
                    expiry_date: (new Date()).getTime() + resultData.expires_in
                }));
            }).catch(err => {
                reject(err);
                Logger.error(err.response);
            });
        });
    }

    /**
     * validate tokens and get new ones if they are not
     *
     * @param tokens
     * @returns {Promise}
     */
    getValidToken(tokens) {
        return new Promise((resolve, reject) => {
            // check if access token has expired
            if (tokens.expiry_date - (new Date()).getTime() >= 0) {
                // not expired, no new tokens
                resolve(true);
            } else {
                // attempt to get  new tokens
                this.refreshAccessToken(tokens)
                    .then(newTokens => resolve(newTokens))
                    .catch(reject);
            }
        });
    }

}