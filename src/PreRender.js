// fix for react imports
require('babel-register');
const Logger = require('./Helpers/Logger');

// static libraries
const createElement = require('react').createElement;
const renderToString = require('react-dom/server').renderToString;
const match = require('react-router').match;
const Provider = require('react-redux').Provider;

// routers for server side
const RouterServer = require('../client/RouterServer').default;
const Routes = require('../client/RouterServer').Routes;

// redux store/provider
const Store = require('../client/Store.jsx').default;

module.exports = (app) => {
    return new Promise((resolve, reject) => {
        // match the routers
        match({routes: Routes, location: '/'}, (err, redirect, renderProps) => {
            if (err) {
                Logger.error(err);
                reject(err);
            } else if (renderProps) {
                // create a router
                const routerElement = createElement(
                    RouterServer,
                    renderProps
                );

                // create a provider
                const providerElement = createElement(
                    Provider,
                    {store: Store},
                    routerElement
                );

                // we got props, try to render them
                const preRenderedHtml = renderToString(providerElement);

                // resolve the html
                resolve(preRenderedHtml);
            } else {
                // nothing found, return 404
                Logger.error('Create prerenderedhtml returned 404');
                reject('Failed to find a route for /');
            }
        });
    });
}