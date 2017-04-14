import React from "react";

class TitleBar extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    render() {
        return (
            <div className="row center-xs">
                <h1 {...this.props}>
                    {this.props.children}
                </h1>
            </div>
        );
    }
}

export default TitleBar;
