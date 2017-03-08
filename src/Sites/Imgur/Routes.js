const fs = require('fs');
const path = require('path');
const mime = require('mime');
const winston = rootRequire('src/Helpers/Logger.js');

const ImgurHelperObj = require('./Helper');
const UserHelperObj = rootRequire('src/UserHelper.js');

module.exports = (app, passport, uploadApp) => {
    let db = uploadApp._Db;
    let ImgurHelper = new ImgurHelperObj(uploadApp);
    let UserHelper = new UserHelperObj(uploadApp);

    // returns a valid oauth url for the client
    app.get('/login/imgur', (request, response) => {
        if (!request.user) {
            // not logged in
            response.redirect('/');
        } else {

            var redirectToUrl = true;

            // check if we already have data for imgur
            if (request.user.provider_sites.imgur) {

                // check if we have a refresh token
                if (request.user.provider_sites.imgur.refresh_token) {
                    redirectToUrl = false;

                    // validate tokens
                    ImgurHelper.createOauthClient(request.user)
                        .then(valid => {
                            // no need to login
                            response.redirect('/');
                        })
                        .catch(err => {
                            // invalid token or something went wrong
                            response.redirect(ImgurHelper.getAuthorizationUrl('code'));
                        })
                }
            }

            if (redirectToUrl) {
                // redirect to imgur login url
                response.redirect(ImgurHelper.getAuthorizationUrl('code'));
            }
        }
    });

    // handles the oauth callback
    app.get('/login/imgur/callback', function (request, response) {
        var code = request.query.code;

        let resultRoute = "/new/imgur";

        // make sure we have a code and we're logged in
        if (!code || !request.user) {
            response.redirect(resultRoute);
            return;
        } else {

            ImgurHelper.requestAccessToken(code)
                .then((result) => {
                    let responseData = result.data;

                    // get collection and current sites
                    var current_provider_sites = request.user.provider_sites;

                    // set new data
                    current_provider_sites.imgur = {
                        access_token: responseData.access_token,
                        expires_in: responseData.expires_in,
                        expiry_date: (new Date()).getTime() + responseData.expires_in,
                        token_type: responseData.token_type,
                        scope: responseData.scope,
                        refresh_token: responseData.refresh_token,
                        account_id: responseData.account_id,
                        account_username: responseData.account_username,
                    };

                    // update the tokens for this user
                    UserHelper.updateUserTokens(request.user, current_provider_sites)
                        .then((result) => {
                            response.redirect(resultRoute);
                        })
                        .catch((err) => {
                            response.redirect(resultRoute);
                        });
                })
                .catch((err) => {
                    response.redirect(resultRoute);
                });
        }
    });

}
