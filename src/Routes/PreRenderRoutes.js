// fix for react imports
require('babel-register');

const Logger = require('../Helpers/Logger');

// static libraries
const fs = require('fs');
const createElement = require('react').createElement;
const createFactory = require('react').createFactory;
const renderToString = require('react-dom/server').renderToString;
const {match, RouterContext} = require('react-router');
const Provider = require('react-redux').Provider;


module.exports = (app, passport, uploadApp) => {

    // routes
    app.get('/pre-render', (req, res) => {
        // require the app
        const App = require('../../client/App.jsx');
        // create a factory which we can parse to the createElement function
        const AppFactory = createFactory(App);
        // attempt to generate the html
        const preRenderedHtml = renderToString(createElement(
            'div',
            {},
            App
        ));
        //render the view using the preRenderedHtml from react
        res.render('index', {
            appPreRender: preRenderedHtml
        });
    })

    // routes
    app.get('/pre-render-router', (req, res) => {
        // fetch the router, store and a redux provider
        const Router = require('../../client/Router.jsx').default;
        const configureStore = require('../../client/Store.jsx');

        match({routes: Router, location: req.url}, (err, redirect, renderProps) => {
            Logger.debug(err, typeof err);
            Logger.debug(redirect, typeof redirect);
            Logger.debug(renderProps, typeof renderProps);

            if (err) {
                Logger.error(err);
                // error, show index
                return res.status(500).render('index');
            } else if (redirect) {
                // redirected by react router
                res.redirect(302, redirect.pathname + redirect.search);

            } else if (renderProps) {
                // we got props, try to render them
                let store = configureStore()
                const preRenderedHtml = renderToString(
                    createElement(
                        Provider,
                        {store},
                        createElement(RouterContext, renderProps)
                    )
                )
                // return the home template + preRenderedHtml from react
                res.render('index', {
                    appPreRender: preRenderedHtml
                });
            } else {
                // nothing found, return 404
                return res.status(404).render('index');
            }
        })
    })

}