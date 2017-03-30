import React from "react";
import Perf from 'react-addons-perf';

// custom components
import PaperHelper from '../Components/Sub/PaperHelper';
import RaisedButton from '../Components/Sub/RaisedButton';
import ComponentLoader from '../Components/Sub/ComponentLoader';
import ForceLogin from '../Helpers/ForceLogin';
import Logger from '../Helpers/Logger';

// async components
const ProviderBlocks = ComponentLoader(
    () => import('../Components/ProviderSites/ProviderBlocks'),
    () => require.resolveWeak('../Components/ProviderSites/ProviderBlocks'));


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

    componentDidMount() {
        ForceLogin(this.props, true);
        Logger.debug('pre-timeout');
        setTimeout(() => {
            Perf.start();
            Logger.debug('start');
            setTimeout(() => {
                Perf.stop();
                const measurements = Perf.getLastMeasurements();
                Perf.printWasted(measurements);
                Logger.debug('print');
            }, 3000);
        }, 2000);
    }

    componentDidUpdate() {
        ForceLogin(this.props, true);
    }

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