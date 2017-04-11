import React from "react";
import Helmet from "react-helmet";
import Paper from "material-ui/Paper";
import CircularProgress from 'material-ui/CircularProgress';
import Check from 'material-ui/svg-icons/navigation/check';
import Error from 'material-ui/svg-icons/alert/error';
import {red500, green800} from 'material-ui/styles/colors';
import {browserHistory}  from 'react-router';
import axios from 'axios';

import Utils from '../Helpers/Utils';

const styles = {
    inputs: {
        width: '100%',
    },
    paperWrapper: {
        marginTop: 40,
        textAlign: 'center'
    },
    paper: {
        width: '100%',
        padding: 20,
        textAlign: 'center',
        display: 'inline-block',
    },
    checkIcon: {
        width: 60,
        height: 60,
        color: green800
    },
    errorIcon: {
        width: 60,
        height: 60,
        color: red500
    }
};

class DropboxLoginCallback extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            loading: true,
            error: false
        };
    };

    componentDidMount() {
        this.sendTokens();
    }

    sendTokens = () => {
        // send the post request
        axios.post("/login/dropbox/callback", Utils.getHashParams())
            .then((result) => {
                this.setState({
                    loading: false
                });

                // update the current user
                this.props.updateUser();

                setTimeout(() => {
                    // send home after waiting a while
                    browserHistory.push('/');
                }, 1000);
            })
            .catch((error) => {
                console.error(error);
                this.setState({
                    error: true
                });
                setTimeout(() => {
                    // send home after waiting a while
                    browserHistory.push('/');
                }, 1000);
            })
    }


    render() {
        var icon = <CircularProgress color="rgb(28, 142, 215)" size={80} thickness={6}/>;

        if (this.state.error) {
            icon = (
                <h3>
                    <Error style={styles.errorIcon}/>
                    <br/>
                    Something went wrong
                </h3>
            )
        } else if (!this.state.loading) {
            icon = (
                <h3>
                    <Check style={styles.checkIcon}/>
                    <br/>
                    Connected your Dropbox account
                </h3>
            )
        }

        return (
            <div style={styles.paperWrapper}
                 className="col-xs-12 col-md-8 col-md-offset-2 col-lg-6 col-lg-offset-3">
                <Helmet>
                    <title>{`UploadBroBot - Dropbox Login`}</title>
                </Helmet>
                <Paper style={styles.paper}>
                    <h1>Logging in to Dropbox</h1>
                    {icon}
                </Paper>
            </div>
        );
    };
}

export default DropboxLoginCallback;
