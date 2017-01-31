import React from "react";
import FlatButton from "material-ui/FlatButton";

import NavLink from "../Helpers/NavLink";

class Home extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    };

    componentDidMount() {

    }

    render() {
        var homeDiv = (
            <div style={{
                margin: 30,
                height: '100%',
                textAlign: 'center',
                color: 'white',
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <div className="your-element">
                    You're not logged in. To begin, <br/>
                    <FlatButton
                        secondary={true}
                        label="Login with Telegram"
                        href="/login/telegram"/>
                </div>
            </div>
        );
        if (this.props.user_info) {
            console.log(this.props.user_info);
            homeDiv = (
                <div style={{margin: 30, textAlign: 'center', color: 'white'}}>
                    <div class="your-element">
                        You're logged in as:<br/>
                        {this.props.user_info.username}<br/>
                        {this.props.user_info.first_name} {this.props.user_info.last_name}
                    </div>
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