import React from "react";
import Helmet from "react-helmet";
import Paper from "material-ui/Paper";
import CircularProgress from 'material-ui/CircularProgress';
import RaisedButton from 'material-ui/RaisedButton';
import Check from 'material-ui/svg-icons/navigation/check';
import Error from 'material-ui/svg-icons/alert/error';
import {red500, red800, green800} from 'material-ui/styles/colors';

import Utils from '../Helpers/Utils';
import Logger from '../Helpers/Logger';
import NavLink from '../Components/Sub/NavLink.jsx';
import axios from 'axios';

const styles = {
    img: {
        height: 120,
        padding: 20
    },
    button: {
        width: '100%'
    },
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

class ProviderRemove extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            loadingState: "nope",
            error: false
        };
    }

    componentWillMount() {
        // check if provider is available
        if (!this.props.sites[this.props.params.type]) {
            this.props.router.push('/dashboard');
        }
    }

    removeProvider = () => {
        let providerType = this.props.params.type;

        // send our hashtag data
        axios.post("/api/remove/" + providerType, {_csrf: csrfToken})
            .then((result) => {
                if (result.data) {
                    // update state
                    this.setState({loadingState: "removed"});

                    // update the current user
                    this.props.updateUser();
                    setTimeout(() => {
                        this.props.router.push('/dashboard');
                    }, 2000);
                } else {
                    this.setState({error: true});
                    setTimeout(() => {
                        this.props.router.push('/dashboard');
                    }, 2000);
                }
            })
            .catch((error) => {
                Logger.error(error);
                this.setState({error: true});
                setTimeout(() => {
                    this.props.router.push('/dashboard');
                }, 2000);
            })
    }

    render() {
        // check if provider is available
        if (!this.props.sites[this.props.params.type]) {
            return null;
        }

        // extract name
        let providerType = Utils.ucfirst(this.props.params.type);

        let removeDiv = (
            <div className="row around-xs">
                <div className="col-xs-12">
                    <h1>Remove {providerType}?</h1>
                    <p>This will disable {providerType} service for UploadBro</p>
                </div>

                <div className="col-xs-12">
                    <img src={this.props.sites[this.props.params.type].logos['svg']}
                         style={styles.img}/>
                </div>

                <div className="col-xs-6 col-md-4">
                    <NavLink to="/dashboard">
                        <RaisedButton primary={true}>
                            Cancel
                        </RaisedButton>
                    </NavLink>
                </div>

                <div className="col-xs-6 col-md-4">
                    <RaisedButton secondary={true} backgroundColor={red800}
                                  onClick={this.removeProvider}>
                        Remove
                    </RaisedButton>
                </div>
            </div>
        )
        if (this.state.error) {
            removeDiv = (
                <h3>
                    <Error style={styles.errorIcon}/>
                    <br/>
                    Something went wrong
                </h3>
            )
        } else if (this.state.loadingState === "loading") {
            removeDiv = (
                <div className="row around-xs">
                    <div className="col-xs-12">
                        <h1>Removing {providerType}</h1>
                    </div>

                    <div className="col-xs-12">
                        <div className="box">
                            <CircularProgress color="rgb(28, 142, 215)" size={80} thickness={6}/>
                        </div>
                    </div>
                </div>
            )
        } else if (this.state.loadingState === "removed") {
            removeDiv = (
                <h3>
                    <Check style={styles.checkIcon}/>
                    <br/>
                    Removed your {providerType} account
                </h3>
            )
        }

        return (
            <div style={styles.paperWrapper}
                 className="col-xs-12 col-md-8 col-md-offset-2 col-lg-6 col-lg-offset-3">
                <Paper style={styles.paper}>
                    <Helmet>
                        <title>{`UploadBroBot - Remove ${providerType}`}</title>
                    </Helmet>
                    {removeDiv}
                </Paper>
            </div>
        );
    }
}

export default ProviderRemove;
