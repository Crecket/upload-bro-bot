require('babel-register');

const fs = require('fs');
const createElement = require('react').createElement;
const renderToString = require('react-dom/server').renderToString;
const {match, RouterContext} = require('react-router');

const routes = require('../../client/Router.jsx');
const configureStore = require('../../client/Store.js');
const Provider = require('react-redux').Provider;

// let preRenderReact = (req, res) => {
//     return new Promise((resolve, reject) => {
//         match({routes, location: req.url}, (err, redirect, renderProps) => {
//             if (err) {
//                 console.error('huh err', err);
//                 reject(404);
//             } else if (redirect) {
//                 res.redirect(302, redirect.pathname + redirect.search);
//             } else if (renderProps) {
//                 let store = configureStore();
//                 const ReactApp = renderToString(
//                     createElement(
//                         Provider,
//                         {store},
//                         createElement(RouterContext, renderProps)
//                     )
//                 )
//                 resolve(ReactApp);
//             } else {
//                 reject(404);
//             }
//         })
//     });
// }

module.exports = (app, passport, uploadApp) => {

    // routes
    app.get('/pre-render', (req, res) => {
        console.log(routes);
        match({routes, location: req.url}, (err, redirect, renderProps) => {
            console.log(err, redirect, renderProps);
            if (err) {
                return res.status(500).end();
            } else if (redirect) {
                res.redirect(302, redirect.pathname + redirect.search);
            } else if (renderProps) {
                let store = configureStore()
                const preRenderedHtml = renderToString(
                    createElement(
                        Provider,
                        {store},
                        createElement(RouterContext, renderProps)
                    )
                )
                res.render('index', {
                    appPreRender: preRenderedHtml
                });
            } else {
                return res.status(404).end();
            }
        })
    })

}