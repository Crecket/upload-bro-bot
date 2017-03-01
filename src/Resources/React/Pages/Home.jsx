import React from "react";
import FlatButton from "material-ui/FlatButton";
import Paper from "material-ui/Paper";
import ExitToAppIcon from 'material-ui/svg-icons/action/exit-to-app';

import ProviderBlocks from "../Components/ProviderSites/ProviderBlocks";
import IntroductionScreen from "../Components/IntroductionScreen";

const styles = {
    wrapper: {
        padding: 30,
        minHeight: 300,
        // color: 'white'
    },
    centerBox: {
        minHeight: 200,
        alignContent: 'center',
        alignItems: 'center',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'center'
    },
    notLoggedIn: {
        textAlign: 'center'
    }
}

export default class Home extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    };

    render() {
        var homeDiv = (
            <div style={styles.notLoggedIn}>
                You're not logged in yet. <br/>

                <br/>
                <br/>

                <div className="row center-xs">
                    <div className="col-xs-12 col-sm-6 col-md-4">
                        <Paper className="box" style={styles.centerBox}>
                            <FlatButton
                                secondary={true}
                                label="Login with Telegram"
                                href="/login/telegram"/>
                            <br/>
                            <br/>
                            <ExitToAppIcon/>
                        </Paper>
                    </div>
                    <div className="col-xs-12 col-sm-6 col-md-4">
                        <Paper className="box" style={styles.centerBox}>
                            <FlatButton
                                secondary={true}
                                label="Login with Telegram"
                                href="/login/telegram"/>
                        </Paper>
                    </div>
                </div>
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