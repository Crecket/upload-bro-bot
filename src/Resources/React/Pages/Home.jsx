import React from "react";
import FlatButton from "material-ui/FlatButton";

import ProviderBlocks from "../Components/ProviderSites/ProviderBlocks";
import IntroductionScreen from "../Components/IntroductionScreen";
import NavLink from "../Helpers/NavLink";

const styles = {
    wrapper: {
        padding: 30,
        // color: 'white'
    },
    notLoggedIn: {
        textAlign: 'center'
    }
}

class Home extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    };

    render() {
        var homeDiv = (
            <div style={styles.notLoggedIn}>
                You're not logged in. To begin, <br/>
                <FlatButton
                    secondary={true} target="_blank"
                    label="Login with Telegram"
                    href="/login/telegram"/>
            </div>
        );
        if (this.props.user_info) {
            console.log(this.props.user_info);
            homeDiv = (
                <div>
                    <div className="row">
                        <div className="box">
                            You're logged in as:<br/>
                            {this.props.user_info.username}<br/>
                            {this.props.user_info.first_name} {this.props.user_info.last_name}
                        </div>
                    </div>
                    <ProviderBlocks provider_sites={this.props.user_info.provider_sites}/>
                </div>
            );
        }

        return (
            <div style={styles.wrapper}>
                <IntroductionScreen/>
                {homeDiv}
            </div>
        );
    };
}

export default Home;