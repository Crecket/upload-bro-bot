import React from "react";
import Helmet from "react-helmet";
import Paper from "material-ui/Paper";
import { Redirect } from "react-router-dom";
import CircularProgress from "material-ui/CircularProgress";
import Check from "material-ui/svg-icons/navigation/check";
import Error from "material-ui/svg-icons/alert/error";
import { green800, red500 } from "material-ui/styles/colors";
import { browserHistory } from "react-router";
import axios from "axios";

import Utils from "../Helpers/Utils";
import Logger from "../Helpers/Logger";

const styles = {
    inputs: {
        width: "100%"
    },
    paperWrapper: {
        marginTop: 40,
        textAlign: "center"
    },
    paper: {
        width: "100%",
        padding: 20,
        textAlign: "center",
        display: "inline-block"
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

class ClientLoginCallback extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            redirect: false,
            loading: true,
            error: false
        };
    }

    componentDidMount() {
        this.sendTokens();
    }

    sendTokens = () => {
        const providerType = this.props.match.params.type;

        // send the post request
        axios
            .post(`/login/${providerType}/callback`, Utils.getHashParams())
            .then(result => {
                this.setState({
                    loading: false
                });

                // update the current user
                this.props.updateUser();

                // after timeout trigger redirect
                setTimeout(() => {
                    this.setState({ redirect: "/dashboard" });
                }, 2000);
            })
            .catch(error => {
                Logger.error(error);
                this.setState({
                    error: true
                });

                // after timeout trigger redirect
                setTimeout(() => {
                    this.setState({ redirect: "/dashboard" });
                }, 2000);
            });
    };

    render() {
        if (this.state.redirect) return <Redirect to={this.state.redirect} />;

        // check if provider is available
        if (!this.props.sites[this.props.match.params.type]) {
            return null;
        }
        const providerTitle = this.props.sites[this.props.match.params.type]
            .title;

        var icon = (
            <CircularProgress
                color="rgb(28, 142, 215)"
                size={80}
                thickness={6}
            />
        );

        if (this.state.error) {
            icon = (
                <h3>
                    <Error style={styles.errorIcon} />
                    <br />
                    Something went wrong
                </h3>
            );
        } else if (!this.state.loading) {
            icon = (
                <h3>
                    <Check style={styles.checkIcon} />
                    <br />
                    Connected your {providerTitle} account
                </h3>
            );
        }

        return (
            <div
                style={styles.paperWrapper}
                className="col-xs-12 col-md-8 col-md-offset-2 col-lg-6 col-lg-offset-3"
            >
                <Helmet>
                    <title>{`UploadBroBot - ${providerTitle} Login`}</title>
                </Helmet>
                <Paper style={styles.paper}>
                    <h1>
                        Logging in to {providerTitle}
                    </h1>
                    {icon}
                </Paper>
            </div>
        );
    }
}

export default ClientLoginCallback;
