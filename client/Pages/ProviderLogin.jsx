import React from "react";
import Helmet from "react-helmet";
import { Redirect } from "react-router-dom";
import Paper from "material-ui/Paper";
import Check from "material-ui/svg-icons/navigation/check";
import CircularProgress from "material-ui/CircularProgress";
import Error from "material-ui/svg-icons/alert/error";
import { green800, red500 } from "material-ui/styles/colors";

import Utils from "../Helpers/Utils";

const styles = {
    img: {
        maxHeight: 120,
        padding: 20
    },
    button: {
        width: "100%"
    },
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

export default class ProviderLogin extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            redirect: false
        };
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({ redirect: "/dashboard" });
        }, 2000);
    }

    render() {
        if (this.state.redirect) return <Redirect to={this.state.redirect} />;

        // default to loading screen
        let loginStatusResult = (
            <CircularProgress
                color="rgb(28, 142, 215)"
                size={80}
                thickness={6}
            />
        );

        // verify if initial check has completed
        if (this.props.initialCheck) {
            // verify if user info is set for given login attempt
            if (
                this.props.user_info &&
                this.props.user_info.provider_sites &&
                this.props.user_info.provider_sites[
                    this.props.match.params.type
                ]
            ) {
                loginStatusResult = (
                    <h3>
                        <Check style={styles.checkIcon} />
                        <br />
                        Successfully logged in to your{" "}
                        {Utils.ucfirst(this.props.match.params.type)} account!
                    </h3>
                );
            } else {
                loginStatusResult = (
                    <h3>
                        <Error style={styles.errorIcon} />
                        <br />
                        Something went wrong
                    </h3>
                );
            }
        }

        return (
            <div
                style={styles.paperWrapper}
                className="col-xs-12 col-md-8 col-md-offset-2 col-lg-6 col-lg-offset-3"
            >
                <Helmet>
                    <title>{`UploadBroBot - ${this.props.match.params
                        .type} Login`}</title>
                </Helmet>
                <Paper style={styles.paper}>
                    {loginStatusResult}
                </Paper>
            </div>
        );
    }
}
