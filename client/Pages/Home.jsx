import React from "react";
// import RaisedButton from "material-ui/RaisedButton";

import PaperHelper from "../Components/Sub/PaperHelper";
import RaisedButton from "../Components/Sub/RaisedButton";
import FeatureList from "../Components/FeatureList";
import YoutubePreview from "../Components/YoutubePreview";
import SiteList from "../Components/SiteList";
import ProviderBlocks from "../Components/ProviderSites/ProviderBlocks";
import ManualLoginPost from "../Helpers/ManualLoginPost";
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
        let homeDiv;

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
                        <div className="col-xs-12 col-sm-6 col-sm-offset-3 col-md-4 col-md-offset-4">
                            <RaisedButton href="https://telegram.me/uploadbro_bot"
                                          style={{width: '100%'}}
                                          rel="noopener" target="_blank" labelColor="#fff"
                                          icon={<img src="/favicon-32x32.png"/>}
                                          label="Get started"
                            />
                        </div>
                    </PaperHelper>
                </div>
            );
        } else {
            // not logged in and initial check is done
            homeDiv = (
                <div>
                    <PaperHelper style={Object.assign(styles.notLoggedIn, styles.centerBox)}>
                        <RaisedButton
                            onClick={ManualLoginPost}
                            primary={true}
                            label="Login with Telegram"/>
                    </PaperHelper>

                    <FeatureList/>
                    <SiteList sites={this.props.sites}/>
                    <YoutubePreview/>
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