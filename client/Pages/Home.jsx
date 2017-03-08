import React from "react";
import RaisedButton from "material-ui/RaisedButton";
import CircularProgress from 'material-ui/CircularProgress';
import PaperHelper from "../Components/PaperHelper";

import FeatureList from "../Components/FeatureList";
import YoutubePreview from "../Components/YoutubePreview";
import SiteList from "../Components/SiteList";
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
        paddingTop: 10,
        paddingBottom: 10,
        textAlign: 'center'
    }
}

export default class Home extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    };

    render() {
        // default state
        let homeDiv = (
            <PaperHelper style={styles.loggedIn}>
                <h1>Loading</h1>
                <CircularProgress size={80} thickness={5}/>
            </PaperHelper>
        );

        // user is logged in
        if (this.props.user_info) {
            homeDiv = (
                <div>
                    <PaperHelper style={styles.loggedIn}>
                        You're logged in as:<br/>
                        {this.props.user_info.username}<br/>
                        {this.props.user_info.first_name} {this.props.user_info.last_name}
                        <br/>
                        <ProviderBlocks
                            provider_sites={this.props.user_info.provider_sites}
                            provider_sites_info={this.props.sites}
                        />
                    </PaperHelper>

                    <PaperHelper style={styles.loggedIn}>
                        https://telegram.me/uploadbro_bot
                    </PaperHelper>
                </div>
            );
        } else if (this.props.initialCheck === true) {
            // not logged in and initial check is done
            homeDiv = (
                <div>
                    <PaperHelper style={Object.assign(styles.notLoggedIn, styles.centerBox)}>
                        <RaisedButton
                            primary={true}
                            label="Login with Telegram"
                            href="/login/telegram"/>
                    </PaperHelper>

                    <FeatureList/>
                    <SiteList sites={this.props.sites}/>
                    <YoutubePreview/>
                </div>
            );
        }

        // backgroundColor: this.props.theme.custom.appBackgroundColor
        return (
            <div>
                {homeDiv}
            </div>
        );
    };
}