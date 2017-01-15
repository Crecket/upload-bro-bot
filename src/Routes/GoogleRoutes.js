var fs = require('fs');
var path = require('path');
var mime = require('mime');

var GoogleHelperObj = require('../Sites/Google/GoogleHelper');

module.exports = (app, passport, uploadApp) => {
    var db = uploadApp._Db;
    var GoogleHelper = new GoogleHelperObj(uploadApp);

    // returns a valid oauth url for the client
    app.get('/login/google', (request, response) => {
        if (!request.user) {
            // not logged in
            response.redirect('/');
        } else {
            var urlOptions = {
                access_type: 'offline',
                // approval_prompt: 'force',
                scope: [
                    'https://www.googleapis.com/auth/userinfo.profile',
                    'https://www.googleapis.com/auth/drive.appfolder',
                    'https://www.googleapis.com/auth/drive.file'
                ]
            };

            if (request.user.provider_sites.google) {
                if (!request.user.provider_sites.google.refresh_token) {
                    // already have a google site but no refresh token
                    urlOptions.approval_prompt = 'force';
                }
            } else {
                urlOptions.approval_prompt = 'force';
            }

            // create the url
            var url = GoogleHelper.createOauthClient()
                .generateAuthUrl(urlOptions);

            // redirect to it
            response.redirect(url);
        }
    });

    // handles the oauth callback
    app.get('/login/google/callback', function (request, response) {
        var code = request.query.code;

        // make sure we have a code and we're logged in
        if (!code || !request.user) {
            response.redirect('/');
            return;
        } else {
            GoogleHelper.createOauthClient().getToken(code, function (err, tokens) {
                if (err) {
                    console.log(err);
                    response.redirect('/');
                    return;
                }

                // get collection and current sites
                var current_provider_sites = request.user.provider_sites;
                var usersCollection = db.collection('users');

                if (current_provider_sites['google']) {
                    // already exists, update existing values
                    current_provider_sites.google.expiry_date = tokens.expiry_date;
                    current_provider_sites.google.access_token = tokens.access_token;
                    // current_provider_sites.google.id_token = tokens.id_token;
                } else {
                    // add new provider
                    current_provider_sites.google = {
                        expiry_date: tokens.expiry_date,
                        access_token: tokens.access_token,
                        refresh_token: tokens.refresh_token,
                        // id_token: tokens.id_token,
                    }
                }

                // update provider sites
                usersCollection.updateOne({_id: request.user._id}, {
                    $set: {
                        provider_sites: current_provider_sites
                    }
                }).then((result) => {
                    console.log('mongodb updated');
                    console.log("modifiedCount: ", result.modifiedCount);
                    console.log("upsertedCount: ", result.upsertedCount);
                    response.redirect('/');
                }).catch((err) => {
                    console.log('mongodb error');
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
