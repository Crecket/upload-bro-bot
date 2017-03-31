const Logger = require('../Helpers/Logger');

module.exports = (app, passport, uploadApp) => {

    // routes
    app.get(['/', '/dashboard', '/remove/:type', '/new/:type'], (req, res) => {
        res.set('X-Frame-Options', 'ALLOW-FROM-ALL');
        res.render('index');
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
