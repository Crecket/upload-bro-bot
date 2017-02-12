var fs = require('fs');
var path = require('path');
var mime = require('mime');

var ImgurHelperObj = require('./Helper');
var UserHelperObj = require('../../UserHelper.js');

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

                    // get current user
                    var userInfo = request.user;
                    var userGoogleTokens = userInfo.provider_sites.google;

                    // create a new client
                    var client = GoogleHelper.createOauthClient(userGoogleTokens);

                    // check if token is still valid
                    if (!GoogleHelper.isExpired(client)) {
                        // access token is still valid so we don't need to do this
                        response.redirect('/');
                        return;
                    } else {

                        // get a new access token
                        GoogleHelper.getAccessToken(client)
                            .then((token_result) => {

                                if (token_result.newTokens) {
                                    // store the new tokens
                                    request.user.provider_sites.google = token_result.newTokens;

                                    // update the database
                                    UserHelper.updateUserTokens(request.user)
                                        .then((success) => {
                                            response.redirect('/');
                                        })
                                        .catch((err) => {
                                            console.error(err);
                                            response.redirect('/');
                                        });
                                } else {
                                    response.redirect('/');
                                }

                            })
                            .catch((err) => {
                                console.error(err);
                                response.redirect('/');
                            });
                    }

                    // token is expired but we have a refresh token so no approval prompt required
                    urlOptions.approval_prompt = null;
                }
            }

            if (redirectToUrl) {
                // create the url
                var url = ImgurHelper.getAuthorizationUrl('code');

                // redirect to it
                response.redirect(url);
            }
        }
    });

    // handles the oauth callback
    app.get('/login/imgur/callback', function (request, response) {
        var code = request.query.code;

        let resultRoute = "/login/imgur";

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
