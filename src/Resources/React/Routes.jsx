import React from 'react';
import {Route, IndexRoute} from 'react-router';

import Main from './Components/Main';
import Home from './Pages/Home';
import NotFound from './Pages/NotFound';
import DropboxLoginCallback from './Pages/DropboxLoginCallback';
import ProviderRemove from './Pages/ProviderRemove';
import ProviderLogin from './Pages/ProviderLogin';
import LoginCallback from './Pages/LoginCallback';

export default (
    <Route path="/" component={Main}>
        {/* default route */}
        <IndexRoute component={Home}/>

        {/* Routes*/}
        <Route path='/login' component={LoginCallback}/>
        <Route path='/new/:type' component={ProviderLogin}/>
        <Route path='/remove/:type' component={ProviderRemove}/>
        <Route path='/login/dropbox/callback' component={DropboxLoginCallback}/>

        {/* fall back route, if no others are found show 404*/}
        <Route path='*' component={NotFound}/>
    </Route>
);