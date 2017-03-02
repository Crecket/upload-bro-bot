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

    // returns oembed information
    app.get('/oembed', (req, res) => {
        res.json({
            "provider_url": "https://uploadbro.com",
            "type": "rich",
            "version": "1.0",
            "width": 600,
            "height": 600,
            "html": "<iframe width=\"100%\" height=\"600\" frameborder=\"no\" src=\"https://uploadbro.com\"></iframe>"
        });
    })

    // returns oembed information
    app.get('/api/oembed', (req, res) => {
        res.json({
            "provider_url": "https://uploadbro.com",
            "type": "rich",
            "version": "1.0",
            "width": 600,
            "height": 600,
            "html": "<iframe width=\"100%\" height=\"600\" frameborder=\"no\" src=\"https://uploadbro.com\"></iframe>"
        });
    })

}
