import React from "react";

// custom components
import ManualPost from '../Helpers/ManualPost';
import PaperHelper from '../Components/Sub/PaperHelper';
import RaisedButton from '../Components/Sub/RaisedButton';
// import ComponentLoader from '../Components/Sub/ComponentLoader';

// sync components for testing
import FeatureList from '../Components/FeatureList';
import YoutubePreview from '../Components/YoutubePreview';
import SiteList from '../Components/SiteList';
import ForceLogin from '../Helpers/ForceLogin';

// async components
if (process.env.WEBPACK_MODE) {
    // const FeatureList = ComponentLoader(
    //     () => import('../Components/FeatureList'),
    //     () => require.resolveWeak('../Components/FeatureList'));
    // const YoutubePreview = ComponentLoader(
    //     () => import('../Components/YoutubePreview'),
    //     () => require.resolveWeak('../Components/YoutubePreview'));
    // const SiteList = ComponentLoader(
    //     () => import('../Components/SiteList'),
    //     () => require.resolveWeak('../Components/SiteList'));

    // const FeatureList = ComponentLoader(
    //     () => {
    //         return new Promise((resolve, reject) => {
    //             require.ensure([], (require) => {
    //                 resolve(require('../Components/FeatureList').default);
    //             })
    //         }).catch(console.log);
    //     }
    // );
    // const YoutubePreview = ComponentLoader(
    //     () => {
    //         return new Promise((resolve, reject) => {
    //             require.ensure([], (require) => {
    //                 resolve(require('../Components/YoutubePreview').default);
    //             })
    //         }).catch(console.log);
    //     }
    // );
    // const SiteList = ComponentLoader(
    //     () => {
    //         return new Promise((resolve, reject) => {
    //             require.ensure([], (require) => {
    //                 resolve(require('../Components/SiteList').default);
    //             })
    //         }).catch(console.log);
    //     }
    // );
}

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