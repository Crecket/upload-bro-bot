import React from "react";
import { Router, browserHistory } from "react-router";

// main wrapper
import Routes from "./RoutesSync";

// router react component
export default class CustomRouter extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }
    render() {
        return <Router routes={Routes}
                       history={browserHistory} />;
    }
}
