import React from "react";
import {Provider} from "react-redux";
import {BrowserRouter, Route, Switch} from "react-router-dom";

// injection, required for materialze tap events
import injectTapEventPlugin from "react-tap-event-plugin";
injectTapEventPlugin();

// main wrapper component
import Main from "./Components/Main.jsx";

// the redux store
import Store from "./Store.jsx";

export default class App extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    render() {
        return (
            <Provider store={Store()}>
                <BrowserRouter>
                    <Main/>
                </BrowserRouter>
            </Provider>
        );
    }
}
