import React from 'react';
import {Router, createMemoryHistory,browserHistory} from 'react-router'

// hackfix for server-side test
import injectTapEventPlugin  from 'react-tap-event-plugin';
injectTapEventPlugin();

// wrapper component
import Main from './Components/Main';

// pages
import Home from './Pages/Home';
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

export const RouterJsx = <CustomRouter/>;

export const Routes = RouteList;