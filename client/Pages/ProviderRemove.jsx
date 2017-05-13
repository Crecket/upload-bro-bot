import React from "react";
import Helmet from "react-helmet";
import {Redirect} from "react-router-dom";
import Paper from "material-ui/Paper";
import CircularProgress from "material-ui/CircularProgress";
import RaisedButton from "material-ui/RaisedButton";
import Check from "material-ui/svg-icons/navigation/check";
import Error from "material-ui/svg-icons/alert/error";
import {green800, red500, red800} from "material-ui/styles/colors";
import Swipe from "react-easy-swipe";
import axios from "axios";

import Logger from "../Helpers/Logger";
import NavLink from "../Components/Sub/NavLink";

const styles = {
    img: {
        height: 120,
        padding: 20
    },
    button: {
        width: "100%"
    },
    inputs: {
        width: "100%"
    },
    paperWrapper: {
        marginTop: 20,
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

export default class ProviderRemove extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            redirect: false,
            loadingState: "nope",
            error: false,
            nextSite: false,
            previousSite: false,
            swipeAmount: 0
        };
    }

    componentDidMount() {
        // calculate which items are before/after this site
        const siteKeys = Object.keys(this.props.sites);

        // ensure we have more than 1 site type
        if (siteKeys.length > 1) {
            const siteIndex = siteKeys.indexOf(this.props.match.params.type);

            // on previous-site event go here
            const previousIndex = siteIndex > 0
                ? siteIndex - 1
                : siteKeys.length - 1;
            const previousItem = this.props.sites[siteKeys[previousIndex]];

            // on next-site event go here
            const nextIndex = siteIndex >= siteKeys.length - 1
                ? 0
                : siteIndex + 1;
            const nextItem = this.props.sites[siteKeys[nextIndex]];

            // update state
            this.setState({
                nextSite: nextItem.key,
                previousSite: previousItem.key
            });
        } else {
            // fallback to own type since we don't have more than 1 site
            this.setState({
                nextSite: this.props.match.params.type,
                previousSite: this.props.match.params.type
            });
        }
    }

    componentWillMount() {
        // check if provider is available
        if (!this.props.sites[this.props.match.params.type]) {
            // cancel and go to dashbaord
            this.setState({redirect: "/dashboard"});
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        // dont update if the swipe amount changed
        if (
            nextState.swipeAmount !== this.state.swipeAmount &&
            nextState.swipeAmount !== 0
        ) {
            return false;
        }
        return true;
    }

    // swipe events for mobile
    onSwipeMove(position, event) {
        // update swipe amount in state
        this.setState({swipeAmount: position.x});
    }

    onSwipeEnd(event) {
        Logger.debug(this.state.swipeAmount);

        if (this.state.swipeAmount >= 50) {
            // move to right
            this.setState({redirect: "/remove/" + this.state.nextSite});
        } else if (this.state.swipeAmount <= -50) {
            // move to left
            this.setState({redirect: "/remove/" + this.state.previousSite});
        }
        // reset swipe amount
        this.setState({swipeAmount: 0});
    }

    // do api call to remove this provider from account
    removeProvider = () => {
        let providerType = this.props.match.params.type;

        // set loading state
        this.setState({loadingState: "loading"});

        // send our hashtag data
        axios
            .post("/api/remove/" + providerType)
            .then(result => {
                if (result.data) {
                    // update state
                    this.setState({loadingState: "removed"});

                    // update the current user
                    this.props.updateUser();
                } else {
                    this.setState({error: true});
                }
                setTimeout(() => {
                    this.setState({redirect: "/dashboard"});
                }, 2000);
            })
            .catch(error => {
                // Logger.error(error);
                this.setState({error: true});
                setTimeout(() => {
                    this.setState({redirect: "/dashboard"});
                }, 2000);
            });
    };

    render() {
        if (this.state.redirect) return <Redirect to={this.state.redirect}/>;

        // check if provider is available
        if (!this.props.sites[this.props.match.params.type]) {
            return null;
        }
        const providerTitle = this.props.sites[this.props.match.params.type].title;

        let removeDiv = (
            <div className="row around-xs">
                <div className="col-xs-12">
                    <h1>Remove {providerTitle}?</h1>
                    <p>
                        This will disable {providerTitle} service for UploadBro
                    </p>
                </div>

                <div className="col-xs-12">
                    <img
                        src={
                            this.props.sites[this.props.match.params.type].logos[
                                "svg"
                                ]
                        }
                        style={styles.img}
                    />
                </div>

                <div className="col-xs-6 col-md-4">
                    <NavLink to="/dashboard">
                        <RaisedButton primary={true}>
                            Cancel
                        </RaisedButton>
                    </NavLink>
                </div>

                <div className="col-xs-6 col-md-4">
                    <RaisedButton
                        secondary={true}
                        backgroundColor={red800}
                        onClick={this.removeProvider}
                    >
                        Remove
                    </RaisedButton>
                </div>
            </div>
        );
        if (this.state.error) {
            removeDiv = (
                <h3>
                    <Error style={styles.errorIcon}/>
                    <br />
                    Something went wrong
                </h3>
            );
        } else if (this.state.loadingState === "loading") {
            removeDiv = (
                <div className="row around-xs">
                    <div className="col-xs-12">
                        <h1>Removing {providerTitle}</h1>
                    </div>

                    <div className="col-xs-12">
                        <div className="box">
                            <CircularProgress
                                color="rgb(28, 142, 215)"
                                size={80}
                                thickness={6}
                            />
                        </div>
                    </div>
                </div>
            );
        } else if (this.state.loadingState === "removed") {
            removeDiv = (
                <h3>
                    <Check style={styles.checkIcon}/>
                    <br />
                    Removed your {providerTitle} account
                </h3>
            );
        }

        return (
            <div
                style={styles.paperWrapper}
                className="col-xs-12 col-md-8 col-md-offset-2 col-lg-6 col-lg-offset-3"
            >
                <Paper style={styles.paper}>
                    <Helmet>
                        <title
                        >{`UploadBroBot - Remove ${providerTitle}`}</title>
                    </Helmet>
                    <Swipe
                        onSwipeMove={this.onSwipeMove.bind(this)}
                        onSwipeEnd={this.onSwipeEnd.bind(this)}
                    >
                        {removeDiv}
                    </Swipe>
                </Paper>
            </div>
        );
    }
}
