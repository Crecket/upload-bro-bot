module.exports = (app, passport, uploadApp) => {
    var db = uploadApp._Db;

    // fetch info for all providers
    app.get('/get_providers', (req, res) => {
        res.json(uploadApp._SiteHandler.siteList);
    });

    // fetch info for a single provider
    app.get('/get_provider/:siteKey', (req, res) => {
        res.json(uploadApp._SiteHandler.getSiteBasic(req.params.siteKey));
    });

}
