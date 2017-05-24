const fs = require("fs");
const path = require("path");
const mime = require("mime");
const Logger = require("../../Helpers/Logger");

const OneDriveHelperObj = require("./Helper");
const UserHelperObj = require("../../UserHelper");

module.exports = (app, passport, UploadBro) => {
    var db = UploadBro._Db;
    var OneDriveHelper = new OneDriveHelperObj(UploadBro);
    var UserHelper = new UserHelperObj(UploadBro);

    // returns a valid oauth url for the client
    app.post("/login/onedrive", (request, response) => {
        if (!request.user) {
            // not logged in
            return response.redirect("/");
        }

        // redirect to the auth url helper func
        let redirectToUrl = () => {
            // create the url
            const url = OneDriveHelper.getAuthorizationUrl();
            // redirect to it
            response.redirect(url);
        };

        // check if we already have data for onedrive
        if (request.user.provider_sites.onedrive) {
            // check if we have a refresh token
            if (request.user.provider_sites.onedrive.refresh_token) {
                // create a new client
                OneDriveHelper.createOauthClient(request.user)
                    .then(valid => {
                        response.redirect("/");
                    })
                    .then(err => {
                        // something went wrong or tokens are invalid
                        redirectToUrl();
                    });
            } else {
                // no onedrive provider
                redirectToUrl();
            }
        } else {
            // no onedrive provider
            redirectToUrl();
        }
    });

    // handles the oauth callback
    app.get("/login/onedrive/callback", function(request, response) {
        var code = request.query.code;

        let resultRoute = "/new/onedrive";

        // make sure we have a code and we're logged in
        if (!code || !request.user) {
            response.redirect(resultRoute);
            return;
        } else {
            // create new client
            OneDriveHelper.createOauthClient()
                .then(authclient => {
                    // get token using new code
                    authclient.getToken(code, function(err, tokens) {
                        if (err) {
                            response.redirect(resultRoute);
                            return;
                        }

                        // update or overwrite
                        if (request.user.provider_sites.onedrive) {
                            // already exists, update existing values
                            request.user.provider_sites.onedrive.expiry_date =
                                tokens.expiry_date;
                            request.user.provider_sites.onedrive.access_token =
                                tokens.access_token;
                            request.user.provider_sites.onedrive.id_token =
                                tokens.id_token;
                        } else {
                            // add new provider
                            request.user.provider_sites.onedrive = {
                                expiry_date: tokens.expiry_date,
                                access_token: tokens.access_token,
                                refresh_token: tokens.refresh_token,
                                id_token: tokens.id_token
                            };
                        }

                        // attempt to get information about username
                        OneDriveHelper.userInfo(request.user)
                            .then(user_information => {
                                // merge new user info content
                                request.user.provider_sites.onedrive = Object.assign(
                                    {},
                                    request.user.provider_sites.onedrive,
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
