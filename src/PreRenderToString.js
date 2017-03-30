import React from 'react';

const Logger = require('./Helpers/Logger');

// static libraries
const renderToString = require('react-router-server').renderToString;
const Provider = require('react-redux').Provider;
const createStore = require('redux').createStore;

// routers for server side
const Router = require('../client/RouterServer.jsx').default;

// redux store/provider
const Store = require('../client/Store.jsx').default;
// extra imports so we can create the store oursel
const middlewareExport = require('../client/Store.jsx').middlewareExport;
const reducerExport = require('../client/Store.jsx').reducerExport;
// get the initial default state from the store
const storeInitialState = Store.getState();

export default(renderProps, uploadApp, user = false) => {

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

    // we got props, try to render them
    return renderToString(
        <Provider store={createStore(reducerExport, modifiedState, middlewareExport)}>
            <Router {...renderProps}/>
        </Provider>
    );
}