const axios = require('axios');

module.exports = class ImgurHelper {
    constructor(app) {
        this._app = app;
    }

    /**
     * Returns the url to be used in authorization request
     *
     * @param tokens - token/code/pin
     * @returns {string}
     */
    getAuthorizationUrl(response_type = "token") {
        return "https://api.imgur.com/oauth2/authorize" +
            "?client_id=" + process.env.IMGUR_CLIENT_ID +
            "&response_type=" + response_type +
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
            axios.post("https://api.imgur.com/oauth2/token", {
                code: code,
                client_id: process.env.IMGUR_CLIENT_ID,
                client_secret: process.env.IMGUR_CLIENT_SECRET,
                grant_type: 'authorization_code'
            }).then(resolve).catch(reject);
        });
    }

    validateToken(imgur_info) {
        return new Promise((resolve, reject) => {
            if(imgur_info.expires_in)

            axios.post("https://api.imgur.com/oauth2/token", {
                code: code,
                client_id: process.env.IMGUR_CLIENT_ID,
                client_secret: process.env.IMGUR_CLIENT_SECRET,
                grant_type: 'authorization_code'
            }).then(resolve).catch(reject);
        });
    }

}