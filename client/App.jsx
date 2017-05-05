import React from "react";
import {Provider} from "react-redux";
import {BrowserRouter} from "react-router-dom";
// injection, required for materialze tap events
import injectTapEventPlugin from "react-tap-event-plugin";
// the client route polyfill which renders the app shell
import RoutesClient from "./RoutesClient.jsx";
// main app wrapper
import Main from "./Components/Main.jsx";
// the store
import Store from "./Store.jsx";
injectTapEventPlugin();

export default class App extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    render() {
        return (
            <Provider store={Store()}>
                <BrowserRouter>
                    <Main routesComponent={RoutesClient}/>
                </BrowserRouter>
            </Provider>
        );
    }
}
