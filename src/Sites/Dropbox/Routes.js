const fs = require("fs");
const path = require("path");
const mime = require("mime");
const winston = rootRequire("src/Helpers/Logger.js");

const DropboxHelperObj = require("./Helper");
const UserHelperObj = require(__base + "src/UserHelper.js");

module.exports = (app, passport, uploadApp) => {
    var db = uploadApp._Db;
    var DropboxHelper = new DropboxHelperObj(uploadApp);
    var UserHelper = new UserHelperObj(uploadApp);

    // returns a valid oauth url for the client
    app.post("/login/dropbox", (request, response) => {
        if (!request.user) {
            // not logged in
            response.redirect("/");
        } else {
            // check if we already have data for dropbox
            if (request.user.provider_sites.dropbox) {
                response.redirect("/");
            } else {
                // create the url
                var url = DropboxHelper.createClient().getAuthenticationUrl(
                    process.env.WEBSITE_URL + process.env.DROPBOX_REDIRECT_URI
                );

                // redirect to it
                response.redirect(url);
            }
        }
    });

    // handles the oauth callback
    app.get("/login/dropbox/callback", function (request, response) {
        response.render("index");
    });
    app.post("/login/dropbox/callback", function (request, response) {
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
            let current_provider_sites = request.user.provider_sites;

            // add new provider
            current_provider_sites.dropbox = {
                access_token: access_token,
                token_type: token_type,
                uid: uid,
                account_id: account_id
            };

            // get user info for this user
            DropboxHelper.getUserInfo(request.user)
                .then(({
                           account_id,
                           name,
                           email,
                           email_verified,
                           profile_photo_url
                       }) => {
                    // update user info in dropbox
                    current_provider_sites.dropbox = Object.assign(
                        current_provider_sites.dropbox,
                        {
                            name: name,
                            display_name: name.display_name,
                            email: email,
                            avatar: profile_photo_url
                        }
                    );

                    // update the tokens for this user
                    UserHelper.updateUserTokens(
                        request.user,
                        current_provider_sites
                    )
                        .then(_ => {
                            response.json(true);
                        })
                        .catch(err => {
                            winston.error(err);
                            response.status(500).json({error: err});
                        });
                })
                .catch(err => {
                });
        }
    });
};
