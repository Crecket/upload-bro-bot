import React from 'react';
import {Route, IndexRoute} from 'react-router';

import Main from './Components/Main';
import Home from './Pages/Home';
import Login from './Pages/Login';
import NotFound from './Pages/NotFound';
import DropboxLoginCallback from './Pages/DropboxLoginCallback';
import GoogleLoginCallback from './Pages/GoogleLoginCallback';

export default (
    <Route path="/" component={Main}>
        {/* default route */}
        <IndexRoute component={Home}/>

        {/* Routes*/}
        <Route path='/login' component={Login}/>
        <Route path='/login/google/callback' component={GoogleLoginCallback}/>
        <Route path='/login/dropbox/callback' component={DropboxLoginCallback}/>

        {/* fall back route, if no others are found show 404*/}
        <Route path='*' component={NotFound}/>
    </Route>
);