import React from 'react';
import {Router, browserHistory} from 'react-router'

import Main from './Components/Main';

const routeList = {
    path: '',
    component: Main,
    childRoutes: [
        {
            path: '/',
            getComponent(nextState, cb) {
                // import('./Pages/Home.jsx').then(component => {cb(null, component)});
                require.ensure([], (require) => {
                    let Component = require("./Pages/Home.jsx").default;
                    cb(null, props => <Component {...props}/>);
                })
            }
        },
        {
            path: '/new/:type',
            getComponent(nextState, cb) {
                // import('./Pages/Home.jsx').then(component => {cb(null, component)});
                let Component = require("./Pages/ProviderLogin.jsx").default;
                cb(null, props => <Component {...props}/>);
            }
        },
        {
            path: '/remove/:type',
            getComponent(nextState, cb) {
                // import('./Pages/Home.jsx').then(component => {cb(null, component)});
                let Component = require("./Pages/ProviderRemove.jsx").default;
                cb(null, props => <Component {...props}/>);
            }
        },
        {
            path: '/login/dropbox/callback',
            getComponent(nextState, cb) {
                // import('./Pages/Home.jsx').then(component => {cb(null, component)});
                let Component = require("./Pages/DropboxLoginCallback.jsx").default;
                cb(null, props => <Component {...props}/>);
            }
        },
        {
            path: '/*',
            getComponent(nextState, cb) {
                // import('./Pages/Home.jsx').then(component => {cb(null, component)});
                let Component = require("./Pages/NotFound.jsx").default;
                cb(null, props => <Component {...props}/>);
            }
        },
    ]
};

export default class CustomRouter extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    };

    render() {
        return <Router routes={routeList} history={browserHistory}/>;
    };
};

export let RouterJsx = <Router/>;