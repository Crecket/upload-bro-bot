const fs = require("fs");
const path = require("path");
const mime = require("mime");

const GfycatHelper = require("./Helper");
const UserHelperObj = require("../../UserHelper");

module.exports = (app, passport, UploadBro) => {
    let db = UploadBro._Db;
    let GfycatHelperObj = new GfycatHelper(UploadBro);
    let UserHelper = new UserHelperObj(UploadBro);

    // returns a valid oauth url for the client
    app.post("/login/gfycat", (request, response) => {
        if (!request.user) {
            // not logged in
            response.redirect("/");
        } else {
            var redirectToUrl = true;

            // check if we already have data for gfycat
            if (request.user.provider_sites.gfycat) {
                // check if we have a refresh token
                if (request.user.provider_sites.gfycat.refresh_token) {
                    redirectToUrl = false;

                    // validate tokens
                    GfycatHelperObj.createOauthClient(request.user)
                        .then(valid => {
                            // no need to login
                            response.redirect("/");
                        })
                        .catch(err => {
                            // invalid token or something went wrong
                            response.redirect(
                                GfycatHelperObj.getAuthorizationUrl("code")
                            );
                        });
                }
            }

            if (redirectToUrl) {
                // redirect to gfycat login url
                response.redirect(GfycatHelperObj.getAuthorizationUrl("code"));
            }
        }
    });

    // handles the oauth callback
    app.get("/login/gfycat/callback", function (request, response) {
        var code = request.query.code;

        let resultRoute = "/new/gfycat";

        // make sure we have a code and we're logged in
        if (!code || !request.user) {
            response.redirect(resultRoute);
            return;
        } else {
            GfycatHelperObj.requestAccessToken(code)
                .then(result => {
                    let responseData = result.data;

                    // get collection and current sites
                    const current_provider_sites = request.user.provider_sites;

                    // set new data
                    current_provider_sites.gfycat = {
                        access_token: responseData.access_token,
                        expires_in: responseData.expires_in,
                        expiry_date: new Date().getTime() +
                        responseData.expires_in,
                        token_type: responseData.token_type,
                        scope: responseData.scope,
                        refresh_token: responseData.refresh_token,
                        account_id: responseData.account_id,
                        display_name: responseData.account_username,
                        avatar: false
                    };

                    // update the tokens for this user
                    UserHelper.updateUserTokens(
                        request.user,
                        current_provider_sites
                    )
                        .then(result => {
                            response.redirect(resultRoute);
                        })
                        .catch(err => {
                            response.redirect(resultRoute);
                        });
                })
                .catch(err => {
                    response.redirect(resultRoute);
                });
        }
    });
};
