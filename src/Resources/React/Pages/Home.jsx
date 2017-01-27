import React from "react";
import FlatButton from "material-ui/FlatButton";

import NavLink from "../Helpers/NavLink";

class Home extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    };

    render() {
        var homeDiv = (
            <div style={{margin: 30, textAlign: 'center', color: 'white'}}>
                You're not logged in. To begin, <br/>
                <FlatButton secondary={true} label="Login with Telegram" href="/login/telegram"/>
            </div>
        );
        if (this.props.us) {
            homeDiv = (
                <div style={{margin: 30, textAlign: 'center', color: 'white'}}>
                    You're logged in
                </div>
            );
        }

        return (
            <div>
                {homeDiv}
            </div>
        );
    };
}

export default Home;