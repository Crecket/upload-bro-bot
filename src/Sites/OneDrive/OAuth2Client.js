const axios = require("axios");
const Logger = require("../../Helpers/Logger");

module.exports = class OAuth2Client {
    constructor() {}

    setCredentials = tokens => {
        const {
            access_token,
            refresh_token = false,
            expires_in,
            expires_at
        } = tokens;
        this._access_token = access_token;
        this._refresh_token = refresh_token;
        this._expires_in = expires_in;
        this._expires_at = expires_at;
    };

    /**
     * Only checks if we have a valid access token
     * @returns {boolean}
     */
    accessTokenIsValid = () => {
        if (!this._access_token) {
            // no access token
            return false;
        }
        if (this._expires_at < new Date().getTime()) {
            // access token expired
            return false;
        }
        return true;
    };

    /**
     * Returns a boolean or new valid tokens
     * @param force_refresh
     * @returns {Promise.<*>}
     */
    getValid = async (force_refresh = false) => {
        if (this.accessTokenIsValid()) {
            return true;
        }
        if (force_refresh || this._refresh_token) {
            try {
                return await this.refreshTokens();
            } catch (ex) {
                Logger.error(ex);
                return false;
            }
        }
    };

    /**
     * Gets a new access token using a existing refresh token
     * @returns {Promise.<void>}
     */
    refreshTokens = async () => {
        // we have a refresh token, attempt to get new tokens
        const tokens = await this.getResponse(
            `https://login.microsoftonline.com/common/oauth2/v2.0/token`,
            {
                method: "POST",
                data: {
                    client_id: process.env.ONEDRIVE_CLIENT_ID,
                    redirect_uri: `${process.env.WEBSITE_URL}${process.env.ONEDRIVE_REDIRECT_URI}`,
                    client_secret: process.env.ONEDRIVE_CLIENT_SECRET,
                    refresh_token: this._refresh_token,
                    grant_type: "refresh_token"
                }
            }
        );
        return tokens;
    }

    /**
     * Gets a new access and refresh token using a code
     * @param code
     * @returns {Promise.<void>}
     */
    getToken = async (code) => {
        // we have a refresh token, attempt to get new tokens
        return await this.getResponse(
            `https://login.microsoftonline.com/common/oauth2/v2.0/token`,
            {
                method: "POST",
                data: {
                    client_id: process.env.ONEDRIVE_CLIENT_ID,
                    redirect_uri: `${process.env.WEBSITE_URL}${process.env.ONEDRIVE_REDIRECT_URI}`,
                    client_secret: process.env.ONEDRIVE_CLIENT_SECRET,
                    code: code,
                    grant_type: "refresh_token"
                }
            }
        );
    }

    /**
     * Does a request to the one drive api using our tokens
     * @param url
     * @param method
     * @param data
     * @param options
     * @returns {Promise.<void>}
     */
    getResponse = async (
        url,
        { method = "GET", data = {}, headers = {}, ...options }
    ) => {
        const response = await axios({
            url: url,
            method: method,
            data: data,
            headers: {
                ...headers,
                Authorization: `bearer ${this._access_token}`
            },
            ...options
        });
        return response.data;
    };
};
