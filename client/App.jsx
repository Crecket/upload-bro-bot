import React from 'react';
import {Provider} from "react-redux";
import injectTapEventPlugin  from 'react-tap-event-plugin';

// injection, required for materialze tap events
injectTapEventPlugin();

// Register service worker
// require('./ServiceWorkers/ServiceWorkerRegistration');

// main app
import Router from './Router';
import Store from "./Store";

class App extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    };

    render() {
        return (
            <Provider store={Store}>
                <Router/>
            </Provider>
        );
    };
}

export default App;