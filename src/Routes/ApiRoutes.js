const winston = rootRequire('src/Helpers/Logger.js');

module.exports = (app, passport, uploadApp) => {
    var db = uploadApp._Db;

    // fetch info for all providers
    app.get('/api/get_providers', (req, res) => {
        res.json(uploadApp._SiteHandler.siteList);
    });

    // fetch info for a single provider
    app.get('/api/get_provider/:siteKey', (req, res) => {
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
            })
            // telegram tokens
            delete user_info.accessToken;
            delete user_info.refreshToken;
        }
        res.json(user_info);
    });

}
