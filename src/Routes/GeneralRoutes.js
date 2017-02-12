module.exports = (app, passport, uploadApp) => {
    var db = uploadApp._Db;

    // routes
    app.get(['/', '/remove/:type', '/login/:type'], (req, res) => {
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
                .then((result) => {
                    response.json(true);
                })
                .catch((err) => {
                    response.json(false);
                });
        } else {
            // doesn't exist
            response.json(true);
        }
    });

    // logout page
    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

}
