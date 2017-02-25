import React from "react";
import FlatButton from "material-ui/FlatButton";

import ProviderBlocks from "../Components/ProviderSites/ProviderBlocks";
import IntroductionScreen from "../Components/IntroductionScreen";
import NavLink from "../Helpers/NavLink";
import Trend from 'react-trend';

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
                You're not logged in yet. <br/>
                <FlatButton
                    secondary={true}
                    label="Login with Telegram"
                    href="/login/telegram"/>
            </div>
        );
        if (this.props.user_info) {
            homeDiv = (
                <div>
                    <div className="row center-xs">
                        <div className="box">
                            You're logged in as:<br/>
                            {this.props.user_info.username}<br/>
                            {this.props.user_info.first_name} {this.props.user_info.last_name}
                        </div>
                    </div>
                    <ProviderBlocks
                        provider_sites={this.props.user_info.provider_sites}
                        provider_sites_info={this.props.sites}
                    />

                    <Trend
                        smooth
                        autoDraw
                        autoDrawDuration={1500}
                        autoDrawEasing="ease-out"
                        data={[0, 1]}
                        gradient={['#42b3f4']}
                        radius={1.1}
                        strokeWidth={5}
                        strokeLinecap={'butt'}
                    />
                </div>
            );
        }

        return (
            <div style={styles.wrapper}>
                {/*<IntroductionScreen/>*/}
                {homeDiv}
            </div>
        );
    };
}

export default Home;