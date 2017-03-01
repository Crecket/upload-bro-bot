import React from "react";
import RaisedButton from "material-ui/RaisedButton";
import PaperHelper from "../Components/PaperHelper";

import FeatureList from "../Components/FeatureList";
import YoutubePreview from "../Components/YoutubePreview";
import ProviderBlocks from "../Components/ProviderSites/ProviderBlocks";
// import IntroductionScreen from "../Components/IntroductionScreen";

const styles = {
    centerBox: {
        alignContent: 'center',
        alignItems: 'center',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'center'
    },
    notLoggedIn: {
        textAlign: 'center',
        minHeight: 200
    },
    loggedIn: {
        textAlign: 'center'
    }
}

export default class Home extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    };

    render() {
        let homeDiv = (
            <PaperHelper style={Object.assign(styles.notLoggedIn, styles.centerBox)}>
                <RaisedButton
                    primary={true}
                    label="Login with Telegram"
                    href="/login/telegram"/>
            </PaperHelper>
        );
        if (this.props.user_info) {
            homeDiv = (
                <PaperHelper style={styles.loggedIn}>
                    You're logged in as:<br/>
                    {this.props.user_info.username}<br/>
                    {this.props.user_info.first_name} {this.props.user_info.last_name}
                    <ProviderBlocks
                        provider_sites={this.props.user_info.provider_sites}
                        provider_sites_info={this.props.sites}
                    />
                </PaperHelper>
            );
        }

        // backgroundColor: this.props.theme.custom.appBackgroundColor
        return (
            <div>
                {homeDiv}
                <FeatureList/>
                <YoutubePreview/>
            </div>
        );
    };
}