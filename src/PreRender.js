// fix for react imports
require('babel-register');
const Logger = require('./Helpers/Logger');

// route matcher for react router
const match = require('react-router').match;

// routers for server side
const Routes = require('../client/RouterServer.jsx').Routes;

// alternate way to render the strings
// const renderToString = require('react-router-server').renderToString;
const renderToString = require('./PreRenderToString').default;

module.exports = (uploadApp, user = false) => {
    return new Promise((resolve, reject) => {
        // match the routers based on logged in state
        match({routes: Routes, location: user ? '/' : '/dashboard'}, (err, redirect, renderProps) => {
            if (err) {
                // Error during render
                Logger.error(err);
                reject(err);
            } else if (renderProps) {
                // we got props, try to render them
                renderToString(renderProps, uploadApp, user)
                    .then(({html}) => {
                        // resolve the html
                        resolve(html);
                    }).catch(Logger.error);
            } else {
                // nothing found, return 404
                Logger.error('Create prerenderedhtml returned 404');
                reject('Failed to find a route for /');
            }
        });
    });
}