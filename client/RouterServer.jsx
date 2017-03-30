import React from 'react';
import {Router, createMemoryHistory} from 'react-router'

// injection, required for materialze tap events
import injectTapEventPlugin  from 'react-tap-event-plugin';
injectTapEventPlugin();

// wrapper component
import Main from './Components/Main';

// pages
import Home from './Pages/Home';
import Dashboard from './Pages/Dashboard';
import ProviderLogin from './Pages/ProviderLogin';
import ProviderRemove from './Pages/ProviderRemove';
import DropboxLoginCallback from './Pages/DropboxLoginCallback';
import NotFound from './Pages/NotFound';

// route list
const RouteList = {
    path: '',
    component: Main,
    childRoutes: [
        {path: '/', component: Home},
        {path: '/dashboard', component: Dashboard},
        {path: '/new/:type', component: ProviderLogin},
        {path: '/remove/:type', component: ProviderRemove},
        {path: '/login/dropbox/callback', component: DropboxLoginCallback},
        {path: '/*', component: NotFound}
    ]
};

// router component
export default class CustomRouter extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    };

    render() {
        return <Router routes={RouteList}
                       history={createMemoryHistory('/')}/>;
    };
};

export const Routes = RouteList;