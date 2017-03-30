import React from 'react';
import {Router, browserHistory} from 'react-router'

// main wrapper
import Main from './Components/Main';

// list of routes
const Routes = {
    path: '',
    component: Main,
    childRoutes: [
        {
            path: '/',
            getComponent(nextState, cb) {
                require.ensure([], (require) => cb(null, require('./Pages/Home')));
                // import('./Pages/Home.jsx').then(component => cb(null, component.default));
            }
        },
        {
            path: '/dashboard',
            getComponent(nextState, cb) {
                require.ensure([], (require) => cb(null, require('./Pages/Dashboard')));
                // import('./Pages/Dashboard.jsx').then(component => cb(null, component.default));
            }
        },
        {
            path: '/new/:type',
            getComponent(nextState, cb) {
                require.ensure([], (require) => cb(null, require('./Pages/ProviderLogin')));
                // import('./Pages/ProviderLogin.jsx').then(component => cb(null, component.default));
            }
        },
        {
            path: '/remove/:type',
            getComponent(nextState, cb) {
                require.ensure([], (require) => cb(null, require('./Pages/ProviderRemove')));
                // import('./Pages/ProviderRemove.jsx').then(component => cb(null, component.default));
            }
        },
        {
            path: '/login/dropbox/callback',
            getComponent(nextState, cb) {
                require.ensure([], (require) => cb(null, require('./Pages/DropboxLoginCallback')));
                // import('./Pages/DropboxLoginCallback.jsx').then(component => cb(null, component.default));
            }
        },
        {
            path: '/*',
            getComponent(nextState, cb) {
                require.ensure([], (require) => cb(null, require('./Pages/NotFound')));
                // import('./Pages/NotFound.jsx').then(component => cb(null, component.default));
            }
        },
    ]
};

// router react component
export default class CustomRouter extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    };

    render() {
        return <Router routes={Routes}
                       history={browserHistory}/>;
    };
};

export let routes = Routes;