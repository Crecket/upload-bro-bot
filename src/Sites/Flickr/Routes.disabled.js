const fs = require("fs");
const path = require("path");
const mime = require("mime");
const Logger = require("../../Helpers/Logger");

const GoogleHelperObj = require("./Helper");
const UserHelperObj = require("../../UserHelper");

module.exports = (app, passport, uploadApp) => {
    var db = uploadApp._Db;
    var GoogleHelper = new GoogleHelperObj(uploadApp);
    var UserHelper = new UserHelperObj(uploadApp);

    // returns a valid oauth url for the client
    app.post("/login/flickr", (request, response) => {
        if (!request.user) {
            // not logged in
            return response.redirect("/");
        }
        var urlOptions = {
            access_type: "offline",
            approval_prompt: "force",
            scope: [
                "https://www.flickrapis.com/auth/userinfo.profile",
                "https://www.flickrapis.com/auth/drive"

                // 'https://www.flickrapis.com/auth/drive.appfolder',

                // 'https://www.flickrapis.com/auth/drive.file'
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
                    Logger.error(err);
                    // redirect to home, something went terribly wrong
                    response.redirect("/");
                });
        };

        // check if we already have data for flickr
        if (request.user.provider_sites.flickr) {
            // check if we have a refresh token
            if (request.user.provider_sites.flickr.refresh_token) {
                // create a new client
                GoogleHelper.createOauthClient(request.user)
                    .then(valid => {
                        response.redirect("/");
                    })
                    .then(err => {
                        // something went wrong or tokens are invalid
                        redirectToUrl();
                    });
            } else {
                // no flickr provider
                redirectToUrl();
            }
        } else {
            // no flickr provider
            redirectToUrl();
        }
    });

    // handles the oauth callback
    app.get("/login/flickr/callback", function (request, response) {
        var code = request.query.code;

        let resultRoute = "/new/flickr";

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

                        // update or overwrite
                        if (request.user.provider_sites.flickr) {
                            // already exists, update existing values
                            request.user.provider_sites.flickr.expiry_date =
                                tokens.expiry_date;
                            request.user.provider_sites.flickr.access_token =
                                tokens.access_token;
                            request.user.provider_sites.flickr.id_token =
                                tokens.id_token;
                        } else {
                            // add new provider
                            request.user.provider_sites.flickr = {
                                expiry_date: tokens.expiry_date,
                                access_token: tokens.access_token,
                                refresh_token: tokens.refresh_token,
                                id_token: tokens.id_token
                            };
                        }

                        // attempt to get information about username
                        GoogleHelper.userInfo(request.user)
                            .then(user_information => {
                                // merge new user info content
                                request.user.provider_sites.flickr = Object.assign(
                                    {},
                                    request.user.provider_sites.flickr,
                                    {
                                        avatar: user_information.user.photoLink,
                                        display_name: user_information.user
                                            .displayName,
                                        email: user_information.user
                                            .emailAddress
                                    }
                                );

                                // update the tokens for this user
                                UserHelper.updateUserTokens(
                                    request.user,
                                    request.user.provider_sites
                                )
                                    .then(result => {
                                        response.redirect(resultRoute);
                                    })
                                    .catch(err => {
                                        Logger.error(err);
                                        response.redirect(resultRoute);
                                    });
                            })
                            .catch(err => {
                                Logger.error(err);
                                response.redirect(resultRoute);
                            });
                    });
                })
                .catch(err => {
                    // log and redirect
                    Logger.error(err);
                    response.redirect(resultRoute);
                });
        }
    });
};
