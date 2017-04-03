const Logger = rootRequire('src/Helpers/Logger.js');

module.exports = (app, passport, uploadApp) => {

    // fetch info for all providers
    app.post('/api/get_providers', (req, res) => {
        res.json(uploadApp._SiteHandler.siteList);
    });

    // fetch info for a single provider
    app.post('/api/get_provider/:siteKey', (req, res) => {
        res.json(uploadApp._SiteHandler.getSiteBasic(req.params.siteKey));
    });

    // fetch user info from api
    app.post('/api/get_user', (req, res) => {
        let user_info = (req.user) ? req.user : false;
        if (user_info) {
            // site provider tokens
            Object.keys(user_info.provider_sites).map(key => {
                delete user_info.provider_sites[key].id_token;
                delete user_info.provider_sites[key].access_token;
                delete user_info.provider_sites[key].refresh_token;
            });
            // telegram tokens
            delete user_info.accessToken;
            delete user_info.refreshToken;
        }
        res.json(user_info);
    });

    // fetch user info from api
    app.post('/api/remove/:type', (request, response) => {
        let type = request.params.type;

        // get the site
        if (request.user.provider_sites[type]) {
            // site exists
            delete request.user.provider_sites[type];

            // update the tokens for this user
            uploadApp._UserHelper.updateUserTokens(request.user)
                .then(result => {
                    Logger.debug('success');
                    response.json(true);
                })
                .catch(err => {
                    Logger.debug('failed1');
                    response.status(500).json(false);
                });
        } else {
            // doesn't exist
            response.json(false);
        }
    });
}
