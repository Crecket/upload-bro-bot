// fix for react imports
require('babel-register');
const Logger = require('./Helpers/Logger');

// static libraries
const createElement = require('react').createElement;
const renderToString = require('react-dom/server').renderToString;
const match = require('react-router').match;
const Provider = require('react-redux').Provider;
const createStore = require('redux').createStore;

// routers for server side
const RouterServer = require('../client/RouterServer.jsx').default;
const Routes = require('../client/RouterServer.jsx').Routes;

// redux store/provider
const Store = require('../client/Store.jsx').default;
// extra imports so we can create the store oursel
const middlewareExport = require('../client/Store.jsx').middlewareExport;
const reducerExport = require('../client/Store.jsx').reducerExport;
const storeInitialState = Store.getState();

module.exports = (uploadApp, user = false) => {
    return new Promise((resolve, reject) => {
        // match the routers based on logged in state
        match({routes: Routes, location: user ? '/' : '/dashboard'}, (err, redirect, renderProps) => {
            if (err) {
                // Error during render
                Logger.error(err);
                reject(err);
            } else if (renderProps) {

                // initialState modifications
                let modifiedState = Object.assign({}, storeInitialState, {
                    sites: Object.assign({}, storeInitialState.sites, {
                        sites: uploadApp._SiteHandler.siteList,
                        loading: false
                    }),
                    user: Object.assign({}, storeInitialState.user, {
                        user_info: user
                    })
                });
                // Logger.debug(modifiedState);

                // create a router
                const routerElement = createElement(
                    RouterServer,
                    renderProps
                );

                // create a provider
                const providerElement = createElement(
                    Provider,
                    {store: createStore(reducerExport, modifiedState, middlewareExport)},
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