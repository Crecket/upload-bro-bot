const Logger = rootRequire('src/Helpers/Logger.js');

const BoxHelperObj = require('./Helper');
const UserHelperObj = require('./../../UserHelper.js');

module.exports = (app, passport, uploadApp) => {
    let BoxHelper = new BoxHelperObj(uploadApp);
    let UserHelper = new UserHelperObj(uploadApp);

    // returns a valid oauth url for the client
    app.get('/login/box2', (request, response) => {
        response.json(true);
    });

    // returns a valid oauth url for the client
    app.get('/login/box', (request, response) => {
        if (!request.user) {
            // not logged in
            return response.redirect('/');
        }

        // check if we already have data for imgur
        if (request.user.provider_sites.box) {
            // check if we have a refresh token
            if (request.user.provider_sites.box.refresh_token) {
                // no need to login for this user
                return response.redirect('/');
            }
        }

        // redirect to imgur login url
        response.redirect(BoxHelper.getAuthorizationUrl());
    });

    // handles the oauth callback
    app.get('/login/box/callback', function (request, response) {
        let code = request.query.code;
        let resultRoute = "/new/box";

        // make sure we have a code and we're logged in
        if (!code || !request.user) {
            response.redirect(resultRoute);
            return;
        } else {
            BoxHelper.requestAccessToken(code)
                .then((result) => {
                    let responseData = result;

                    // get collection and current sites
                    var current_provider_sites = request.user.provider_sites;

                    // set new data
                    current_provider_sites.box = {
                        access_token: responseData.accessToken,
                        refresh_token: responseData.refreshToken,
                        accessTokenTTLMS: responseData.accessTokenTTLMS,
                        acquiredAtMS: responseData.acquiredAtMS,
                        expiry_date: (new Date()).getTime() + parseInt(responseData.accessTokenTTLMS / 1000),
                    };

                    // update the tokens for this user
                    UserHelper.updateUserTokens(request.user, current_provider_sites)
                        .then((result) => {
                            response.redirect(resultRoute);
                        })
                        .catch((err) => {
                            response.redirect(resultRoute);
                        });
                })
                .catch((err) => {
                    response.redirect(resultRoute);
                });
        }
    });

}
