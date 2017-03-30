const PreRender = require('../PreRender');
const Logger = require('../Helpers/Logger');

module.exports = (app, passport, uploadApp) => {
    const preRenderRoute = (req, res) => {
        PreRender(app)
            .then(preRenderedHtml => {
                res.render('index', {
                    appPreRender: preRenderedHtml
                });
            })
            .catch(Logger.error);
    };

    app.get('/pre-render-router', preRenderRoute);
    app.get('/pre-render-router-sw', preRenderRoute);
}