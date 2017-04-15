// modules/NavLink.js
import React from "react";
import { Link } from "react-router";
import createReactClass from "create-react-class";

export default createReactClass({
    render() {
        return <Link {...this.props} activeClassName="active" />;
    }
});
