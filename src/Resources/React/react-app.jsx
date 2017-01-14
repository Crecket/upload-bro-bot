import React from 'react';
import ReactDOM  from 'react-dom';
import {Provider} from "react-redux";
import injectTapEventPlugin  from 'react-tap-event-plugin';
import {Router, browserHistory} from 'react-router'

// main app
import Logger from './Helpers/Logger.js';
import Routes from './Routes';
import store from "./store";

// injection, required for materialze tap events
injectTapEventPlugin();

require("!css-loader!sass-loader!../scss/index.scss");

// render the react app
ReactDOM.render(
    <Provider store={store}>
        <Router routes={Routes} history={browserHistory}/>
    </Provider>,
    document.getElementById('app')
);

Logger.debug('Mounted react succesfully');
