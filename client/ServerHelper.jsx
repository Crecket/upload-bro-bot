import React from "react";

export default class ServerHelper extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    };

    render() {
        return (
            <div>
                hi
            </div>
        );
    };
}

export let Element = <ServerHelper/>;