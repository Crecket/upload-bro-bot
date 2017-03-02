module.exports = (app, passport, uploadApp) => {
    var db = uploadApp._Db;

    // routes
    app.get(['/', '/remove/:type', '/new/:type'], (req, res) => {
        res.render('index', {});
    })

    // fetch user info from api
    app.post('/get_user', (req, res) => {
        let user_info = (req.user) ? req.user : false;
        res.json(user_info);
    });

    // fetch user info from api
    app.post('/remove/:type', (request, response) => {
        let type = request.params.type;

        // get the site
        if (request.user.provider_sites[type]) {
            // site exists
            delete request.user.provider_sites[type];

            // update the tokens for this user
            uploadApp._UserHelper.updateUserTokens(request.user)
                .then(result => {
                    response.json(true);
                })
                .catch(err => {
                    response.status(500).json(false);
                });
        } else {
            // doesn't exist
            response.json(true);
        }
    });

    // logout page
    app.get('/logout', (request, response) => {
        request.logout();
        response.redirect('/');
    });

    // returns oembed information
    app.get('/oembed', (req, res) => {
        res.json({
            "provider_url": "https://uploadbro.com",
            "type": "rich",
            "version": "1.0",
            "width": 600,
            "height": 600,
            "html": "<iframe width=\"100%\" height=\"200\" frameborder=\"no\" src=\"https://uploadbro.com\"></iframe>"
        });
    })

}
