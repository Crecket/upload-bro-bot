import React from 'react';
import {Provider} from "react-redux";
import injectTapEventPlugin  from 'react-tap-event-plugin';

// injection, required for materialze tap events
injectTapEventPlugin();

// main app
import Router from './RouterSync';
import Store from "./Store";

export default class App extends React.Component {
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