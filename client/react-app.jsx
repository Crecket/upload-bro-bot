import React from 'react';
import ReactDOM  from 'react-dom';
import injectTapEventPlugin  from 'react-tap-event-plugin';

// Register service worker
require('./ServiceWorkers/ServiceWorkerRegistration');

// main app
import ComponentLoader from './Components/Sub/ComponentLoader';
import Logger from './Helpers/Logger';
// import App from './App';

// injection, required for materialze tap events
injectTapEventPlugin();

require("../node_modules/flexboxgrid/dist/flexboxgrid.css");
require("./Scss/index.scss");

// async load the main App
const App = ComponentLoader(
    () => import('./App'),
    () => require.resolveWeak('./App'));

// render the react app
ReactDOM.render(
    <App/>,
    document.getElementById('app')
);

Logger.debug('Mounted react succesfully');
