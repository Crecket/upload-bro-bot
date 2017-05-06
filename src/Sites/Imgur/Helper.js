const fs = require("fs");
const path = require("path");
const axios = require("axios");
const Logger = require("../../Helpers/Logger");

module.exports = class ImgurHelper {
    constructor(app) {
        this._app = app;
    }

    /**
     * gets a imgur object with the given keys set for the user
     *
     * @param user
     * @returns {*}
     */
    createOauthClient(user) {
        const tokens = user.provider_sites.imgur;

        // no tokens found, just return the regular client
        if (!tokens) {
            return Promise.reject("Imgur token not set");
        }

        // create new imgur client and set default values
        const Imgur = require("imgur-v2");
        Imgur.setClientId(process.env.IMGUR_CLIENT_ID);
        Imgur.setAPIUrl("https://api.imgur.com/3/");

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
                        this._app._UserHelper
                            .updateUserTokens(newUser)
                            .then(success => {
                                resolve(Imgur);
                            })
                            .catch(reject);
                    } else {
                        // use old tokens, no new tokens have been used
                        Imgur.setAccessToken(tokens.access_token);
                        resolve(Imgur);
                    }
                })
                .catch(reject);
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
                        imgurClient
                            .uploadFile(filePath)
                            .then(json => resolve(json.data))
                            .catch(reject);
                    });
                })
                .catch(reject);
        });
    }

    /**
     * Get image list for the user
     *
     * @param userInfo
     * @returns {Promise}
     */
    imageList(userInfo) {
        return new Promise((resolve, reject) => {
            // create a new ouath client
            this.createOauthClient(userInfo)
                .then(imgurClient => {
                    let accessToken =
                        userInfo.provider_sites.imgur.access_token;
                    let accountUsername =
                        userInfo.provider_sites.imgur.account_username;
                    let requestUrl =
                        process.env.IMGUR_API_URL +
                        "account/" +
                        accountUsername +
                        "/images";

                    // do the request
                    axios({
                        url: requestUrl,
                        headers: {
                            Authorization: "Bearer " + accessToken
                        }
                    })
                        .then(json => resolve(json.data.data))
                        .catch(reject);
                })
                .catch(reject);
        });
    }

    /**
     * Returns the url to be used in authorization request
     *
     * @param tokens - token/code/pin
     * @returns {string}
     */
    getAuthorizationUrl(response_type = "token") {
        return (
            "https://api.imgur.com/oauth2/authorize" +
            "?client_id=" +
            process.env.IMGUR_CLIENT_ID +
            "&response_type=" +
            response_type +
            "&state=" +
            new Date().getTime()
        );
    }

    /**
     * Do authorization request for the given code
     *
     * @param code
     * @returns {Promise}
     */
    requestAccessToken(code) {
        return new Promise((resolve, reject) => {
            // do api call to get access token for the code
            axios
                .post("https://api.imgur.com/oauth2/token", {
                    code: code,
                    client_id: process.env.IMGUR_CLIENT_ID,
                    client_secret: process.env.IMGUR_CLIENT_SECRET,
                    grant_type: "authorization_code"
                })
                .then(resolve)
                .catch(err => {
                    reject(err);
                    Logger.error(err);
                });
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
            axios
                .post("https://api.imgur.com/oauth2/token", {
                    refresh_token: tokens.refresh_token,
                    client_id: process.env.IMGUR_CLIENT_ID,
                    client_secret: process.env.IMGUR_CLIENT_SECRET,
                    grant_type: "refresh_token"
                })
                .then(result => {
                    let resultData = result.data;

                    // return the new list
                    resolve(
                        Object.assign(resultData, {
                            expiry_date: new Date().getTime() +
                            resultData.expires_in
                        })
                    );
                })
                .catch(err => {
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
            if (tokens.expiry_date - new Date().getTime() >= 0) {
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
};
