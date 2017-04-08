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
            );
        }
        case "rotating-plane": {
            return (
                <div class="rotating-plane"></div>
            );
        }
        case "double-bounce": {
            return (
                <div>
                    <div class="double-bounce1"></div>
                    <div class="double-bounce2"></div>
                </div>
            );
        }
        case "rectangle-bounce": {
            return (
                <li class="rectangle-bounce">
                    <div class="rect1"></div>
                    <div class="rect2"></div>
                    <div class="rect3"></div>
                    <div class="rect4"></div>
                    <div class="rect5"></div>
                </li>
            );
        }
        default: {
            throw new Error('Invalid loading type');
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
            <div className="sk-loader">
                {getLoaderType(this.props.loadingType || "cube-grid")}
            </div>
        );
    }
}

export default LoadingScreen;
