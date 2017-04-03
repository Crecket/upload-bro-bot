import React from "react";
import {Helmet} from "react-helmet";
import RaisedButton from 'material-ui/RaisedButton';

// custom components
import PaperHelper from '../Components/Sub/PaperHelper';
import ComponentLoader from '../Components/Sub/ComponentLoader';
import ForceLogin from '../Helpers/ForceLogin';

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

    componentWillMount() {
        // Logger.debug('start');
        // Perf.start();
    }

    componentDidMount() {
        ForceLogin(this.props, true);
        // Logger.debug('pre-timeout');
        // setTimeout(() => {
        //     Logger.debug('stop');
        //     Perf.stop();
        //     const measurements = Perf.getLastMeasurements();
        //     Logger.debug('print');
        //     Perf.printWasted(measurements);
        // }, 2000);
    }

    componentDidUpdate() {
        ForceLogin(this.props, true);
    }

    render() {
        return (
            <div>
                <Helmet>
                    <title>UploadBroBot - Dashboard</title>
                </Helmet>
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
                        <a href="https://telegram.me/uploadbro_bot"
                           rel="noopener" target="_blank">
                            <RaisedButton
                                icon={<img src="/assets/img/telegram.svg" style={{width: 32}}/>}
                            />
                        </a>
                    </div>
                </PaperHelper>
            </div>
        );
    };
}