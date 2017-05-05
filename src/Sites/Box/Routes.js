"use strict";
const Logger = rootRequire("src/Helpers/Logger.js");

const BoxHelper = require("./Helper");
const UserHelper = require("./../../UserHelper.js");

module.exports = (app, passport, uploadApp) => {
    let BoxHelperObj = new BoxHelper(uploadApp);
    let UserHelperObj = new UserHelper(uploadApp);

    // returns a valid oauth url for the client
    app.post("/login/box", (request, response) => {
        // return response.redirect('/');
        if (!request.user) {
            // not logged in
            return response.redirect("/");
        }

        // check if we already have data for imgur
        if (request.user.provider_sites.box) {
            // check if we have a refresh token
            if (request.user.provider_sites.box.refresh_token) {
                // no need to login for this user
                return response.redirect("/");
            }
        }

        // redirect to imgur login url
        response.redirect(BoxHelperObj.getAuthorizationUrl());
    });

    // handles the oauth callback
    app.get("/login/box/callback", function (request, response) {
        // return response.redirect('/');
        let code = request.query.code;
        let resultRoute = "/new/box";

        // make sure we have a code and we're logged in
        if (!code || !request.user) {
            response.redirect(resultRoute);
            return;
        } else {
            // get access token for given code
            BoxHelperObj.requestAccessToken(code)
                .then(result => {
                    let responseData = result;

                    // set new data
                    request.user.provider_sites.box = {};
                    request.user.provider_sites.box = {
                        accessToken: responseData.accessToken,
                        refreshToken: responseData.refreshToken,
                        accessTokenTTLMS: responseData.accessTokenTTLMS,
                        acquiredAtMS: responseData.acquiredAtMS,
                        expiry_date: new Date().getTime() +
                        parseInt(responseData.accessTokenTTLMS / 1000)
                    };

                    // create a client to fetch the user info
                    BoxHelperObj.createOauthClient(request.user)
                        .then(BoxClient => {
                            // get user info for current user
                            BoxClient.users.get(
                                "me",
                                null,
                                (err, currentUser) => {
                                    if (err) {
                                        Logger.error(err);
                                        return response.redirect(resultRoute);
                                    }

                                    // store the new user info
                                    request.user.provider_sites.box.user_info = currentUser;
                                    request.user.provider_sites.box.display_name =
                                        currentUser.name;
                                    request.user.provider_sites.box.avatar =
                                        currentUser.avatar_url;

                                    // update the tokens for this user
                                    UserHelperObj.updateUserTokens(request.user)
                                        .then(result => {
                                            response.redirect(resultRoute);
                                        })
                                        .catch(err => {
                                            response.redirect(resultRoute);
                                        });
                                }
                            );
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
        }
    });
};
