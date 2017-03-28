import React from 'react';
import {Provider} from "react-redux";
import {Router, browserHistory} from 'react-router'

// main app
import routes from './Routes';
import Store from "./Store";

class App extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    };

    render() {
        return (
            <Provider store={Store}>
                <Router routes={routes} history={browserHistory}/>
            </Provider>
        );
    };
}

export default App;