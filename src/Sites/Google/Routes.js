const fs = require('fs');
const path = require('path');
const mime = require('mime');
const winston = rootRequire('src/Helpers/Logger.js');

const GoogleHelperObj = require('./Helper');
const UserHelperObj = rootRequire('src/UserHelper.js');

module.exports = (app, passport, uploadApp) => {
    var db = uploadApp._Db;
    var GoogleHelper = new GoogleHelperObj(uploadApp);
    var UserHelper = new UserHelperObj(uploadApp);

    // returns a valid oauth url for the client
    app.get('/login/google', (request, response) => {
        if (!request.user) {
            // not logged in
            return response.redirect('/');
        }
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

        // redirect to the auth url helper func
        let redirectToUrl = () => {
            // create the url
            GoogleHelper.createOauthClient()
                .then(authclient => {
                    let url = authclient.generateAuthUrl(urlOptions);

                    // redirect to it
                    response.redirect(url);
                })
                .catch(err => {
                    winston.error(err);
                    // redirect to home, something went terribly wrong
                    response.redirect('/');
                });
        }

        // check if we already have data for google
        if (request.user.provider_sites.google) {

            // check if we have a refresh token
            if (request.user.provider_sites.google.refresh_token) {

                // create a new client
                GoogleHelper.createOauthClient(request.user)
                    .then(valid => {
                        response.redirect('/');
                    })
                    .then(err => {
                        // something went wrong or tokens are invalid
                        redirectToUrl();
                    })
            } else {
                // no google provider
                redirectToUrl();
            }
        } else {
            // no google provider
            redirectToUrl();
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
                                winston.error(err);
                                response.redirect(resultRoute);
                            });
                    });
                })
                .catch(err => {
                    // log and redirect
                    winston.error(err);
                    response.redirect(resultRoute);
                });
        }
    });

    // debug routes
    if (process.env.DEBUG) {
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
        });

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
        });

        app.get('/test_google/files_list', (request, response) => {
            // get file list
            GoogleHelper.getFilesList(request.user.provider_sites.google)
                .then((result) => {
                    response.json(result);
                })
                .catch((err) => {
                    response.json(err);
                });
        });

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
        });
    }
}
