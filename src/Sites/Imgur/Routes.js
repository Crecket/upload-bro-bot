var fs = require('fs');
var path = require('path');
var mime = require('mime');

var GoogleHelperObj = require('./Helper');
var UserHelperObj = require('../../UserHelper.js');

module.exports = (app, passport, uploadApp) => {
    var db = uploadApp._Db;
    var GoogleHelper = new GoogleHelperObj(uploadApp);
    var UserHelper = new UserHelperObj(uploadApp);

    // returns a valid oauth url for the client
    app.get('/login/imgur', (request, response) => {
        if (!request.user) {
            // not logged in
            response.redirect('/');
        } else {
            var urlOptions = {
                access_type: 'offline',
                approval_prompt: 'force',
                scope: [
                    'https://www.googleapis.com/auth/userinfo.profile',
                    'https://www.googleapis.com/auth/drive.appfolder',
                    'https://www.googleapis.com/auth/drive.file'
                ]
            };
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
                var url = GoogleHelper.createOauthClient()
                    .generateAuthUrl(urlOptions);

                // redirect to it
                // response.json(url);
                response.redirect(url);
            }
        }
    });

    // handles the oauth callback
    app.get('/login/google/callback', function (request, response) {
        var code = request.query.code;

        return response.json(request.query);

        // make sure we have a code and we're logged in
        if (!code || !request.user) {
            response.redirect('/');
            return;
        } else {


            // // get collection and current sites
            // var current_provider_sites = request.user.provider_sites;
            //
            // if (current_provider_sites['google']) {
            //     // already exists, update existing values
            //     current_provider_sites.imgur.expiry_date = tokens.expiry_date;
            //     current_provider_sites.imgur.access_token = tokens.access_token;
            //     current_provider_sites.imgur.id_token = tokens.id_token;
            // } else {
            //     // add new provider
            //     current_provider_sites.imgur = {
            //         expiry_date: tokens.expiry_date,
            //         access_token: tokens.access_token,
            //         refresh_token: tokens.refresh_token,
            //         id_token: tokens.id_token,
            //     }
            // }
            //
            // // update the tokens for this user
            // UserHelper.updateUserTokens(request.user, current_provider_sites)
            //     .then((result) => {
            //         response.redirect('/');
            //     })
            //     .catch((err) => {
            //         console.log(err);
            //         response.redirect('/');
            //     });
        }
    });

}
