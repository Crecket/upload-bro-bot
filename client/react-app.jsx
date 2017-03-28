import React from 'react';
import ReactDOM  from 'react-dom';
import injectTapEventPlugin  from 'react-tap-event-plugin';

// Register service worker
require('./ServiceWorkers/ServiceWorkerRegistration');

// async loader and logger
import ComponentLoader from './Components/Sub/ComponentLoader';

// injection, required for materialze tap events
injectTapEventPlugin();

// async load the main App
const App = ComponentLoader(() => import('./App'), () => require.resolveWeak('./App'));

// render the react app
ReactDOM.render(<App/>, document.getElementById('app'));
