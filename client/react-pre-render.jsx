import React from 'react';
import ReactDOM  from 'react-dom';
import injectTapEventPlugin  from 'react-tap-event-plugin';
import {Provider} from "react-redux";
import {Router, browserHistory} from 'react-router'

// Register service worker
require('./ServiceWorkers/ServiceWorkerRegistration');

// stylesheets
require("../node_modules/flexboxgrid/dist/flexboxgrid.css");
require("./Scss/index.scss");

// main app
import routes from './Router';
import Store from "./Store";

// injection, required for materialze tap events
injectTapEventPlugin();

// render the react app
ReactDOM.render(
    <Provider store={Store}>
        <Router routes={routes} history={browserHistory}/>
    </Provider>
    , document.getElementById('app'));
