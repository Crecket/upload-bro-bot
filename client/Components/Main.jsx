import React from "react";
import store from "store";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import { Route, Switch } from "react-router-dom";
import TransitionGroup from "react-transition-group/TransitionGroup";

// custom components
import MainAppbar from "./MainAppbar";
import Logger from "../Helpers/Logger";
import FadesIn from "../Components/Transitions/FadesIn";
import ComponentLoader from "./Sub/ComponentLoader";

// pages
// import Home from "./Pages/Home.jsx";
// import Dashboard from "./Pages/Dashboard.jsx";
// import ThemeTest from "./Pages/ThemeTest.jsx";
// import ProviderLogin from "./Pages/ProviderLogin.jsx";
// import ProviderRemove from "./Pages/ProviderRemove.jsx";
// import DropboxLoginCallback from "./Pages/DropboxLoginCallback.jsx";
// import NotFound from "./Pages/NotFound.jsx";
const Home = ComponentLoader(() => import("../Pages/Home"));
const Dashboard = ComponentLoader(() => import("../Pages/Dashboard"));
const ThemeTest = ComponentLoader(() => import("../Pages/ThemeTest"));
const ProviderLogin = ComponentLoader(() => import("../Pages/ProviderLogin"));
const ProviderRemove = ComponentLoader(() => import("../Pages/ProviderRemove"));
const DropboxLoginCallback = ComponentLoader(() =>
    import("../Pages/DropboxLoginCallback")
);
const NotFound = ComponentLoader(() => import("../Pages/NotFound"));

// Themes
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import LightBlue from "../Themes/LightBlue";
import Dark from "../Themes/Dark";

// navigator fallback for server-side rendering
const navigatorHelper = typeof navigator !== "undefined" && navigator.userAgent
    ? navigator.userAgent
    : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36";
const ThemesList = {
    LightBlue: getMuiTheme(LightBlue, { userAgent: navigatorHelper }),
    Dark: getMuiTheme(Dark, { userAgent: navigatorHelper })
};
const ThemeListNames = Object.keys(ThemesList);

// redux actions
import { openModal, closeModal } from "../Actions/modalActions.js";
import {
    userUpdate,
    userLogout,
    userLoadLocalstorage
} from "../Actions/user.js";
import { siteUpdate, siteLoadLocalstorage } from "../Actions/sites.js";

// connect to redux

class Main extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            // theme options
            muiTheme: store.get("theme") || "Dark" // default to dark
        };
    }

    componentDidMount() {
        // initial localstorage check
        this.props.dispatch(userLoadLocalstorage());
        this.props.dispatch(siteLoadLocalstorage());

        // update user status
        this.updateUser();

        // fetch site data
        this.props.dispatch(siteUpdate());
    }

    // =========== Static data =============

    // change the theme
    setTheme = (theme = false) => {
        // default theme
        let finalTheme = "Dark";
        if (theme && typeof ThemesList[theme] !== "undefined") {
            finalTheme = theme;
        } else {
            // no custom value given or value does not exist, just toggle between dark and light
            if (this.state.muiTheme === "LightBlue") {
                finalTheme = "Dark";
            } else {
                finalTheme = "LightBlue";
            }
        }

        // set the theme and store it
        this.setState({ muiTheme: finalTheme }, () => {
            store.set("theme", finalTheme);
        });
    };

    // open the general modal
    openModalHelper = (message, title) => {
        this.props.dispatch(openModal(message, title));
    };

    // close the general modal
    closeModalHelper = () => {
        this.props.dispatch(closeModal());
    };

    // update current user info
    updateUser = () => {
        this.props.dispatch(userUpdate());
    };
    logoutUser = () => {
        this.props.dispatch(userLogout());
    };

    render() {
        // generate a list of props we want to give to the children
        const childProps = {
            key: this.props.location.pathname,
            initialCheck: this.props.initialCheck,
            user_info: this.props.user_info,
            sites: this.props.sites,
            theme: ThemesList[this.state.muiTheme],
            updateUser: this.updateUser,
            openModalHelper: this.openModalHelper,
            closeModalHelper: this.closeModalHelper
        };

        return (
            <MuiThemeProvider muiTheme={ThemesList[this.state.muiTheme]}>
                <div
                    className={
                        "container-fluid react-root " + this.state.muiTheme
                    }
                    style={{
                        backgroundColor: ThemesList[this.state.muiTheme]
                            .rawTheme.palette.appBackgroundColor
                    }}
                >
                    <div className={"row center-xs"}>
                        <div className="col-xs-12 col-md-12 col-lg-10">
                            <div
                                className="box"
                                style={{
                                    paddingBottom: 30,
                                    position: "relative"
                                }}
                            >
                                <Dialog
                                    title={this.props.modalTitle}
                                    actions={[
                                        <FlatButton
                                            label="Ok"
                                            primary={true}
                                            keyboardFocused={true}
                                            onTouchTap={this.closeModalHelper}
                                        />
                                    ]}
                                    modal={false}
                                    open={this.props.modalOpen}
                                    onRequestClose={this.closeModalHelper}
                                >
                                    {this.props.modalText}
                                </Dialog>

                                <MainAppbar
                                    dispatch={this.props.dispatch}
                                    setTheme={this.setTheme}
                                    currentTheme={this.state.muiTheme}
                                    themeList={ThemeListNames}
                                    user_info={this.props.user_info}
                                />

                                <Route
                                    render={({ location }) => (
                                        <TransitionGroup>
                                            <Switch
                                                key={location.key}
                                                location={location}
                                            >
                                                <Route
                                                    exact
                                                    path="/"
                                                    render={({ ...props }) => (
                                                        <Home
                                                            {...props}
                                                            {...childProps}
                                                        />
                                                    )}
                                                />

                                                <Route
                                                    path="/dashboard"
                                                    render={({ ...props }) => {
                                                        const Component = FadesIn(
                                                            Dashboard
                                                        );
                                                        return (
                                                            <Component
                                                                {...props}
                                                                {...childProps}
                                                            />
                                                        );
                                                    }}
                                                />
                                                <Route
                                                    path="/remove/:type"
                                                    render={({ ...props }) => {
                                                        const Component = FadesIn(
                                                            ProviderRemove
                                                        );
                                                        return (
                                                            <Component
                                                                {...props}
                                                                {...childProps}
                                                            />
                                                        );
                                                    }}
                                                />
                                                <Route
                                                    path="/theme"
                                                    render={({ ...props }) => (
                                                        <ThemeTest
                                                            {...props}
                                                            {...childProps}
                                                        />
                                                    )}
                                                />
                                                <Route
                                                    path="/new/:type"
                                                    render={({ ...props }) => (
                                                        <ProviderLogin
                                                            {...props}
                                                            {...childProps}
                                                        />
                                                    )}
                                                />
                                                <Route
                                                    path="/login/dropbox/callback"
                                                    render={({ ...props }) => (
                                                        <DropboxLoginCallback
                                                            {...props}
                                                            {...childProps}
                                                        />
                                                    )}
                                                />

                                                {/*<Route*/}
                                                {/*render={({...props}) => (*/}
                                                {/*<NotFound*/}
                                                {/*{...props}*/}
                                                {/*{...childProps}*/}
                                                {/*/>*/}
                                                {/*)}*/}
                                                {/*/>*/}
                                            </Switch>
                                        </TransitionGroup>
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </MuiThemeProvider>
        );
    }
}
export default withRouter(
    connect(store => {
        return {
            sites: store.sites.sites,

            user_info: store.user.user_info,
            initialCheck: store.user.initialCheck,

            modalText: store.modal.message,
            modalTitle: store.modal.title,
            modalOpen: store.modal.modalOpen
        };
    })(Main)
);
