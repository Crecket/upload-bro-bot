import React from 'react';
import ReactDOM  from 'react-dom';

// js-logger helper
require('js-logger').useDefaults({
    level: process.env.DEBUB ? 0 : 4
});

// async loader and logger
import ComponentLoader from './Components/Sub/ComponentLoader';

// async load the main App
const App = ComponentLoader(() => import('./App'), () => require.resolveWeak('./App'));

// render the react app
ReactDOM.render(<App/>, document.getElementById('app'));
