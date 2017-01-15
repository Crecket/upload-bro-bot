var fs = require('fs');
var path = require('path');
var mime = require('mime');

var DropboxHelperObj = require('../Sites/Dropbox/DropboxHelper');
var UserHelperObj = require('../Userhelper.js');

module.exports = (app, passport, uploadApp) => {
    var db = uploadApp._Db;
    var DropboxHelper = new DropboxHelperObj(uploadApp);
    var UserHelper = new UserHelperObj(uploadApp);

    // returns a valid oauth url for the client
    app.get('/login/dropbox', (request, response) => {
        if (!request.user) {
            // not logged in
            response.redirect('/');
        } else {
            var redirectToUrl = true;

            // check if we already have data for dropbox
            if (request.user.provider_sites.dropbox) {
                response.redirect('/');
            } else {
                // create the url
                var url = DropboxHelper.createClient()
                    .getAuthenticationUrl(process.env.DROPBOX_REDIRECT_URI);

                // redirect to it
                response.json(url);
                // response.redirect(url);
            }
        }
    });

    // handles the oauth callback
    app.get('/login/dropbox/callback', function (request, response) {
        var code = request.query.code;

        var fullUrl = request.protocol + '://' + request.get('host') + request.originalUrl;

        response.json([fullUrl, request.query, request.params]);
        return;

        // make sure we have a code and we're logged in
        if (!code || !request.user) {
            response.redirect('/');
            return;
        } else {
            GoogleHelper.createOauthClient().getToken(code, function (err, tokens) {
                if (err) {
                    response.redirect('/');
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
                        id_token: tokens.id_token,
                    }
                }

                // update the tokens for this user
                UserHelper.updateUserTokens(request.user, current_provider_sites)
                    .then((result) => {
                        response.redirect('/');
                    })
                    .catch((err) => {
                        console.log(err);
                        response.redirect('/');
                    });
            });
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
