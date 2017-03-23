import React from 'react';
import ReactDOM  from 'react-dom';
import {Provider} from "react-redux";
import injectTapEventPlugin  from 'react-tap-event-plugin';
import {Router, browserHistory} from 'react-router'

// Register service worker
require('./Helpers/ServiceWorkerRegistration');

// main app
import Logger from './Helpers/Logger.js';
import routes from './Routes';
import Store from "./Store";

// injection, required for materialze tap events
injectTapEventPlugin();

require("../node_modules/flexboxgrid/dist/flexboxgrid.css");
require("./Scss/index.scss");

// render the react app
ReactDOM.render(
    <Provider store={Store}>
        <Router routes={routes} history={browserHistory}/>
    </Provider>,
    document.getElementById('app')
);

Logger.debug('Mounted react succesfully');
