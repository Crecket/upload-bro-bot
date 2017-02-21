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
    app.get('/login/google', (request, response) => {
        if (!request.user) {
            // not logged in
            response.redirect('/');
        } else {
            var urlOptions = {
                access_type: 'offline',
                approval_prompt: 'force',
                scope: [
                    'https://www.googleapis.com/auth/userinfo.profile',
                    'https://www.googleapis.com/auth/drive',
                    // 'https://www.googleapis.com/auth/drive.appfolder',
                    // 'https://www.googleapis.com/auth/drive.file'
                ]
            };
            // redirect to the auth url
            let redirectToUrl = () => {
                // create the url
                GoogleHelper.createOauthClient()
                    .then(authclient => {
                        let url = authclient.generateAuthUrl(urlOptions);

                        // redirect to it
                        response.redirect(url);
                    })
                    .catch(console.error);
            }

            // check if we already have data for google
            if (request.user.provider_sites.google) {

                // check if we have a refresh token
                if (request.user.provider_sites.google.refresh_token) {

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
                                            // failed to update tokens
                                            redirectToUrl();
                                        });
                                } else {
                                    // failed to get new tokens
                                    redirectToUrl();
                                }
                            })
                            .catch((err) => {
                                // failed to get new access token using refresh token
                                redirectToUrl();
                            });
                    }
                }
            } else {
                // no google provider
                redirectToUrl();
            }

        }
    });

    // handles the oauth callback
    app.get('/login/google/callback', function (request, response) {
        var code = request.query.code;

        let resultRoute = "/new/google";

        // make sure we have a code and we're logged in
        if (!code || !request.user) {
            response.redirect(resultRoute);
            return;
        } else {
            // create new client
            GoogleHelper.createOauthClient()
                .then(authclient => {

                    // get token using new code
                    authclient.getToken(code, function (err, tokens) {
                        if (err) {
                            response.redirect(resultRoute);
                            return;
                        }

                        // get collection and current sites
                        var current_provider_sites = request.user.provider_sites;

                        if (current_provider_sites['google']) {
                            // already exists, update existing values
                            current_provider_sites.google.expiry_date = tokens.expiry_date;
                            current_provider_sites.google.access_token = tokens.access_token;
                            current_provider_sites.google.id_token = tokens.id_token;
                        } else {
                            // add new provider
                            current_provider_sites.google = {
                                expiry_date: tokens.expiry_date,
                                access_token: tokens.access_token,
                                refresh_token: tokens.refresh_token,
                                id_token: tokens.id_token
                            }
                        }

                        // update the tokens for this user
                        UserHelper.updateUserTokens(request.user, current_provider_sites)
                            .then((result) => {
                                response.redirect(resultRoute);
                            })
                            .catch((err) => {
                                response.redirect(resultRoute);
                            });
                    });
                })
                .catch(console.error);

        }
    });

    app.get('/test_google/upload', (request, response) => {
        // get the correct path
        var filePath = path.join(__dirname, '../downloads/127251962/file_1.jpg');

        // upload the file
        GoogleHelper.uploadFile(
            request.user.provider_sites.google,
            filePath,
            "card_v2.jpg"
        )
            .then((result) => {
                response.json(result);
            })
            .catch((err) => {
                response.json(err);
            });
    })

    app.get('/test_google/download', (request, response) => {
        // get the correct path
        var filePath = path.join(__dirname, '../downloads/test.jpg');

        var fileId = "0B0vXmuBIOU5wejlnS19lSlhBdW8";

        // download the file
        GoogleHelper.downloadFile(
            request.user.provider_sites.google,
            fileId,
            filePath
        ).then((result) => {
            response.json(result);
        }).catch((err) => {
            response.json(err);
        });
    })

    app.get('/test_google/files_list', (request, response) => {
        // get file list
        GoogleHelper.getFilesList(request.user.provider_sites.google)
            .then((result) => {
                response.json(result);
            })
            .catch((err) => {
                response.json(err);
            });
    })

    app.get('/test_google/info', (request, response) => {
        var fileId = "0B0vXmuBIOU5wejlnS19lSlhBdW8";

        // download the file
        GoogleHelper.fileInfo(
            request.user.provider_sites.google,
            fileId
        ).then((result) => {
            response.json(result);
        }).catch((err) => {
            response.json(err);
        });
    })


}
