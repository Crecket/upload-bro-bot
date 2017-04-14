import React from "react";
import { Provider } from "react-redux";

// injection, required for materialze tap events
import injectTapEventPlugin from "react-tap-event-plugin";
injectTapEventPlugin();

// main app
import Router from "./Router.jsx";
import Store from "./Store.jsx";

export default class App extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    render() {
        return (
            <Provider store={Store}>
                <Router />
            </Provider>
        );
    }
}
