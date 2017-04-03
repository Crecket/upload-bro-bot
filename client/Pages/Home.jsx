import React from "react";
import Helmet from "react-helmet";

// custom components
import ManualPost from '../Helpers/ManualPost';
import PaperHelper from '../Components/Sub/PaperHelper';
import RaisedButton from 'material-ui/RaisedButton';
import ComponentLoader from '../Components/Sub/ComponentLoader';
import ForceLogin from '../Helpers/ForceLogin';

// async components
const FeatureList = ComponentLoader(
    () => import('../Components/FeatureList'),
    () => require.resolveWeak('../Components/FeatureList'));
const YoutubePreview = ComponentLoader(
    () => import('../Components/YoutubePreview'),
    () => require.resolveWeak('../Components/YoutubePreview'));
const SiteList = ComponentLoader(
    () => import('../Components/SiteList'),
    () => require.resolveWeak('../Components/SiteList'));


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
    }
}

export default class Home extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    };

    componentDidMount() {
        ForceLogin(this.props, false);
    }

    componentDidUpdate() {
        ForceLogin(this.props, false);
    }

    render() {
        return (
            <div>
                <Helmet>
                    <title>{`UploadBroBot - Home`}</title>
                </Helmet>
                <PaperHelper style={Object.assign(styles.notLoggedIn, styles.centerBox)}>
                    <RaisedButton
                        onClick={ManualPost('/login/telegram')}
                        primary={true}
                        label="Login with Telegram"/>
                </PaperHelper>

                <FeatureList/>
                <SiteList sites={this.props.sites}/>
                <YoutubePreview/>
            </div>
        );
    };
}