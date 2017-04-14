"use strict";
import React from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import Dark from "../Themes/Dark.jsx";

// navigator fallback for server-side rendering
const navigatorHelper =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36";

class Wrapper extends React.PureComponent {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    render() {
        // wrap the children in the muitheme for jest tests
        return (
            <MuiThemeProvider
                muiTheme={getMuiTheme(Dark, { userAgent: navigatorHelper })}
                {...this.props}
            >
                {this.props.children}
            </MuiThemeProvider>
        );
    }
}

export default Wrapper;
