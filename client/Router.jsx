import React from 'react';
import {Router, browserHistory} from 'react-router'

// main wrapper
import Main from './Components/Main';
import FadesIn from './Components/Transitions/FadesIn';

// list of routes
const Routes = {
    path: '',
    component: Main,
    childRoutes: [
        {
            path: '/',
            getComponent(nextState, cb) {
                import('./Pages/Home.jsx').then(component => cb(null, FadesIn(component.default)));
            }
        },
        {
            path: '/dashboard',
            getComponent(nextState, cb) {
                import('./Pages/Dashboard.jsx').then(component => cb(null, FadesIn(component.default)));
            }
        },
        {
            path: '/theme',
            getComponent(nextState, cb) {
                import('./Pages/ThemeTest.jsx').then(component => cb(null, FadesIn(component.default)));
            }
        },
        {
            path: '/new/:type',
            getComponent(nextState, cb) {
                import('./Pages/ProviderLogin.jsx').then(component => cb(null, FadesIn(component.default)));
            }
        },
        {
            path: '/remove/:type',
            getComponent(nextState, cb) {
                import('./Pages/ProviderRemove.jsx').then(component => cb(null, FadesIn(component.default)));
            }
        },
        {
            path: '/login/dropbox/callback',
            getComponent(nextState, cb) {
                import('./Pages/DropboxLoginCallback.jsx').then(component => cb(null, FadesIn(component.default)));
            }
        },
        {
            path: '/*',
            getComponent(nextState, cb) {
                import('./Pages/NotFound.jsx').then(component => cb(null, FadesIn(component.default)));
            }
        },
    ],
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
