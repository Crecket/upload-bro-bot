import React from "react";

// custom components
import PaperHelper from '../Components/Sub/PaperHelper';
import RaisedButton from '../Components/Sub/RaisedButton';

// sync components for testing
import ProviderBlocks from '../Components/ProviderSites/ProviderBlocks';

// async components
if (process.env.WEBPACK_MODE) {
    // const ProviderBlocks = ComponentLoader(
    //     () => import('../Components/ProviderSites/ProviderBlocks'),
    //     () => require.resolveWeak('../Components/ProviderSites/ProviderBlocks'));

    // const ProviderBlocks = ComponentLoader(
    //     () => {
    //         return new Promise((resolve, reject) => {
    //             require.ensure([], (require) => {
    //                 resolve(require('../Components/ProviderSites/ProviderBlocks').default);
    //             })
    //         }).catch(console.log);
    //     }
    // );
}

const styles = {
    loggedIn: {
        paddingTop: 10,
        paddingBottom: 10,
        textAlign: 'center'
    }
}

export default class Dashboard extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    };

    render() {

        return (
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
                                      rel="noopener"
                                      target="_blank"
                                      labelColor="#fff"
                                      icon={<img src="/favicon-32x32.png"/>}
                                      label="Get started"
                        />
                    </div>
                </PaperHelper>
            </div>
        );
    };
}