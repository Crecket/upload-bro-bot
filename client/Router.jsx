import React from 'react';
import {Router, browserHistory} from 'react-router'

import Logger from './Helpers/Logger';
import Main from './Components/Main';

// error handler for async loading
let errorLoading = (err) => {
    Logger.error('Dynamic page loading failed', err);
}

const routeList = {
    path: '',
    component: Main,
    childRoutes: [
        {
            path: '/',
            getComponent(nextState, cb) {
                require.ensure([], (require) => {
                    cb(require("./Pages/Home.jsx"));
                })
            }
        },
        {
            path: '/new/:type',
            getComponent(nextState, cb) {
                require.ensure([], (require) => {
                    cb(require("./Pages/ProviderLogin.jsx"));
                })
            }
        },
        {
            path: '/remove/:type',
            getComponent(nextState, cb) {
                require.ensure([], (require) => {
                    cb(require("./Pages/ProviderRemove.jsx"));
                })
            }
        },
        {
            path: '/login/dropbox/callback',
            getComponent(nextState, cb) {
                require.ensure([], (require) => {
                    cb(require("./Pages/DropboxLoginCallback.jsx"));
                })
            }
        },
        {
            path: '/*',
            getComponent(nextState, cb) {
                require.ensure([], (require) => {
                    cb(require("./Pages/NotFound.jsx"));
                })
            }
        },
    ]
};

export default class Routes extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    };

    render() {
        return <Router routes={routeList} history={browserHistory}/>;
    };
}


