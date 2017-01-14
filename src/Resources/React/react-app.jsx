import React from 'react';
import ReactDOM  from 'react-dom';
import {Provider} from "react-redux";
import injectTapEventPlugin  from 'react-tap-event-plugin';
import Logger from './Helpers/Logger.js';

// main app
import Main from './Components/Main';
import store from "./store";

// injection, required for materialze tap events
injectTapEventPlugin();

// render the react app
ReactDOM.render(
    <Provider store={store}>
        <Main />
    </Provider>,
    document.getElementById('app')
);

Logger.debug('Mounted react succesfully');
