import React from 'react';
import {Route, IndexRoute} from 'react-router';

import Main from './Components/Main';
import Home from './Pages/Home';
import Login from './Pages/Login';
import NotFound from './Pages/NotFound';

export default (
    <Route path="/" component={Main}>
        {/* default route */}
        <IndexRoute component={Home}/>

        {/* Routes*/}
        <Route path='/login' component={Login}/>

        {/* fall back route, if no others are found show 404*/}
        <Route path='*' component={NotFound}/>
    </Route>
);