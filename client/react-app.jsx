import React from 'react';
import ReactDOM  from 'react-dom';
import {Provider} from "react-redux";
import injectTapEventPlugin  from 'react-tap-event-plugin';
import {Router, browserHistory} from 'react-router'

// main app
import Logger from './Helpers/Logger.js';
import Routes from './Routes';
import store from "./Store";

// injection, required for materialze tap events
injectTapEventPlugin();

require("../node_modules/flexboxgrid/dist/flexboxgrid.css");
require("./Scss/index.scss");

// render the react app
ReactDOM.render(
    <Provider store={store}>
        <Router routes={Routes} history={browserHistory}/>
    </Provider>,
    document.getElementById('app')
);

Logger.debug('Mounted react succesfully');
