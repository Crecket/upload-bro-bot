import React from 'react';
import ReactDOM  from 'react-dom';

// async loader and logger
import ComponentLoader from './Components/Sub/ComponentLoader';

// async load the main App
// const App = ComponentLoader(
//     () => import('./App'),
//     () => require.resolveWeak('./App')
// );

import App from './App';

// render the react app
ReactDOM.render(<App/>, document.getElementById('app'));
