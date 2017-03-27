import React from "react";

// custom components
import ManualLoginPost from '../Helpers/ManualLoginPost';
import ComponentLoader from '../Components/Sub/ComponentLoader';

// async components
const PaperHelper = ComponentLoader(
    () => import('../Components/Sub/PaperHelper'),
    () => require.resolveWeak('../Components/Sub/PaperHelper'));
const RaisedButton = ComponentLoader(
    () => import('../Components/Sub/RaisedButton'),
    () => require.resolveWeak('../Components/Sub/RaisedButton'));
const FeatureList = ComponentLoader(
    () => import('../Components/FeatureList'),
    () => require.resolveWeak('../Components/FeatureList'));
const YoutubePreview = ComponentLoader(
    () => import('../Components/YoutubePreview'),
    () => require.resolveWeak('../Components/YoutubePreview'));
const SiteList = ComponentLoader(
    () => import('../Components/SiteList'),
    () => require.resolveWeak('../Components/SiteList'));
const ProviderBlocks = ComponentLoader(
    () => import('../Components/ProviderSites/ProviderBlocks'),
    () => require.resolveWeak('../Components/ProviderSites/ProviderBlocks'));

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
                        <br/>
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