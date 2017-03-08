const winston = rootRequire('src/Helpers/Winston.js');

module.exports = (app, passport, uploadApp) => {
    var db = uploadApp._Db;

    // routes
    app.get(['/', '/remove/:type', '/new/:type'], (req, res) => {
        res.set('X-Frame-Options', 'ALLOW-FROM-ALL');
        res.render('index', {});
    })

    // fetch user info from api
    app.post('/get_user', (req, res) => {
        let user_info = (req.user) ? req.user : false;

        // delete telepass access token
        // delete user_info.access_token;
        // delete provider tokens
        // Object.keys(user_info.provider_sites).map(key =>{
        //     delete user_info.provider_sites[key].id_token;
        //     delete user_info.provider_sites[key].access_token;
        //     delete user_info.provider_sites[key].refresh_token;
        // })

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
}
