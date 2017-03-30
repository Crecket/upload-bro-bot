const Logger = require('../Helpers/Logger');

module.exports = (app, passport, uploadApp) => {

    // routes
    app.get(['/', '/dashboard', '/remove/:type', '/new/:type'], (req, res) => {
        res.set('X-Frame-Options', 'ALLOW-FROM-ALL');
        res.render('index');
    });

    // fetch user info from api
    app.post('/api/get_user', (req, res) => {
        let user_info = (req.user) ? req.user : false;
        if (user_info) {
            Object.keys(user_info.provider_sites).map(key => {
                delete user_info.provider_sites[key].id_token;
                delete user_info.provider_sites[key].access_token;
                delete user_info.provider_sites[key].refresh_token;
            })
        }
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
}
