"use strict";
import React from "react";

// get loader types and return setup
const getLoaderType = (type) => {
    switch (type) {
        case "cube-grid": {
            return (
                <div className="sk-cube-grid">
                    <div className="sk-cube sk-cube1"></div>
                    <div className="sk-cube sk-cube2"></div>
                    <div className="sk-cube sk-cube3"></div>
                    <div className="sk-cube sk-cube4"></div>
                    <div className="sk-cube sk-cube5"></div>
                    <div className="sk-cube sk-cube6"></div>
                    <div className="sk-cube sk-cube7"></div>
                    <div className="sk-cube sk-cube8"></div>
                    <div className="sk-cube sk-cube9"></div>
                </div>
            )
        }
    }
}

class LoadingScreen extends React.PureComponent {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    render() {
        return (
            getLoaderType("cube-grid")
        );
    }
}

export default LoadingScreen;
