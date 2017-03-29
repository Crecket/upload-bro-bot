import React from 'react';
import {Provider} from "react-redux";

require("../node_modules/flexboxgrid/dist/flexboxgrid.css");
require("./Scss/index.scss");

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