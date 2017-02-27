const fs = require('fs');
const path = require('path');
const mime = require('mime');
const winston = require('winston');

const DropboxHelperObj = require('./Helper');
const UserHelperObj = require('../../UserHelper.js');

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
            // check if we already have data for dropbox
            if (request.user.provider_sites.dropbox) {
                response.redirect('/');
            } else {
                // create the url
                var url = DropboxHelper.createClient()
                    .getAuthenticationUrl(process.env.WEBSITE_URL + process.env.DROPBOX_REDIRECT_URI);

                // redirect to it
                response.redirect(url);
            }
        }
    });

    // handles the oauth callback
    app.get('/login/dropbox/callback', function (request, response) {
        response.render('index');
    });
    app.post('/login/dropbox/callback', function (request, response) {
        var access_token = request.body.access_token;
        var token_type = request.body.token_type;
        var uid = request.body.uid;
        var account_id = request.body.account_id;

        // make sure we have a code and we're logged in
        if (!access_token || !token_type || !uid || !account_id) {
            response.status(400).json({error: "bad request"});
        } else if (!request.user) {
            response.status(403).json({error: "forbidden"});
        } else {

            // get collection and current sites
            var current_provider_sites = request.user.provider_sites;

            // add new provider
            current_provider_sites.dropbox = {
                access_token: access_token,
                token_type: token_type,
                uid: uid,
                account_id: account_id,
            }

            // update the tokens for this user
            UserHelper.updateUserTokens(request.user, current_provider_sites)
                .then((result) => {
                    response.json(true);
                })
                .catch((err) => {
                    winston.error(err);
                    response.status(500).json({error: err});
                });
        }
    });

    app.get('/test_dropbox/share_link', (req, res) => {
        var token = req.user.provider_sites.dropbox.access_token;
        DropboxHelper.createShareLink('/file_69.jpg', token)
            .then((result) => {
                res.json(result);
            })
            .catch((err) => {
                res.json(err)
            });
    })

    app.get('/test_dropbox/file_list', (req, res) => {
        var token = req.user.provider_sites.dropbox.access_token;
        DropboxHelper.getFilesList('', token)
            .then((result) => {
                res.json(result);
            })
            .catch((err) => {
                res.json(err)
            });
    })

    app.get('/test_dropbox/user_info', (req, res) => {
        var token = req.user.provider_sites.dropbox.access_token;
        DropboxHelper.getUserInfo(token)
            .then((result) => {
                res.json(result);
            })
            .catch((err) => {
                res.json(err)
            });
    })

    /*
     app.get('/test_dropbox/upload', (request, response) => {
     // get the correct path
     var filePath = path.join(__dirname, '../downloads/127251962/file_1.jpg');

     // upload the file
     GoogleHelper.uploadFile(
     request.user.provider_sites.dropbox,
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

     app.get('/test_dropbox/download', (request, response) => {
     // get the correct path
     var filePath = path.join(__dirname, '../downloads/test.jpg');

     var fileId = "0B0vXmuBIOU5wejlnS19lSlhBdW8";

     // download the file
     GoogleHelper.downloadFile(
     request.user.provider_sites.dropbox,
     fileId,
     filePath
     ).then((result) => {
     response.json(result);
     }).catch((err) => {
     response.json(err);
     });
     })

     app.get('/test_dropbox/files_list', (request, response) => {
     // get file list
     GoogleHelper.getFilesList(request.user.provider_sites.dropbox)
     .then((result) => {
     response.json(result);
     })
     .catch((err) => {
     response.json(err);
     });
     })

     app.get('/test_dropbox/info', (request, response) => {
     var fileId = "0B0vXmuBIOU5wejlnS19lSlhBdW8";

     // download the file
     GoogleHelper.fileInfo(
     request.user.provider_sites.dropbox,
     fileId
     ).then((result) => {
     response.json(result);
     }).catch((err) => {
     response.json(err);
     });
     })

     //*/
}
