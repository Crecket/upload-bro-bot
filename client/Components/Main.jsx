import React from "react";
import store from "store";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import Dialog from "material-ui/Dialog";
import Snackbar from "material-ui/Snackbar";
import FlatButton from "material-ui/FlatButton";

// custom components
import MainAppbar from "./MainAppbar";
import Logger from "../Helpers/Logger";

// Themes
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import LightBlue from "../Themes/LightBlue";
// import Dark from "../Themes/Dark";

// navigator fallback for server-side rendering
const navigatorHelper = typeof navigator !== "undefined" && navigator.userAgent
    ? navigator.userAgent
    : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36";
const ThemesList = {
    LightBlue: getMuiTheme(LightBlue, { userAgent: navigatorHelper }),
    // Dark: getMuiTheme(Dark, { userAgent: navigatorHelper }),
};
const ThemeListNames = Object.keys(ThemesList);

// redux actions
import {
    userUpdate,
    userLogout,
    userLoadLocalstorage
} from "../Actions/user.js";
import { openModal, closeModal } from "../Actions/modal.js";
import { openSnackbar, closeSnackbar } from "../Actions/snackbar.js";
import { siteUpdate, siteLoadLocalstorage } from "../Actions/sites.js";

class Main extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            // theme options
            muiTheme: /*store.get("theme") ||*/ "LightBlue"
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

        // hack to allow service worker registration to access this
        window.showSnackbar = this.openSnackbarHelper;
    }

    // =========== Static data =============

    // change the theme
    setTheme = (theme = false) => {
        // default theme
        let finalTheme = "LightBlue";
        if (theme && typeof ThemesList[theme] !== "undefined") {
            finalTheme = theme;
        } else {
            // no custom value given or value does not exist, just toggle between dark and light
            if (this.state.muiTheme === "LightBlue" &&  ThemesList["Dark"]) {
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
    closeModalHelper = () => {
        this.props.dispatch(closeModal());
    };

    // open/close the general snackbar
    openSnackbarHelper = (message, duration = 4000) => {
        this.props.dispatch(openSnackbar(message, duration));
    };

    closeSnackbarHelper = () => {
        this.props.dispatch(closeSnackbar());
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
            // uniqueness
            key: this.props.location.pathname,

            // user specific stuff
            initialCheck: this.props.initialCheck,
            user_info: this.props.user_info,
            updateUser: this.updateUser,

            // site list
            sites: this.props.sites,

            // theme list
            theme: ThemesList[this.state.muiTheme],

            // modal and snackbar helpers
            openModalHelper: this.openModalHelper,
            closeModalHelper: this.closeModalHelper,
            openSnackbarHelper: this.openSnackbarHelper,
            closeSnackbarHelper: this.closeSnackbarHelper
        };

        // get the component from the props
        const RouteComponent = this.props.routesComponent;

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
                                <Snackbar
                                    open={this.props.snackbarOpen}
                                    message={this.props.snackbarMessage}
                                    autoHideDuration={
                                        this.props.snackbarDuration
                                    }
                                    onRequestClose={this.closeSnackbarHelper}
                                />

                                <MainAppbar
                                    dispatch={this.props.dispatch}
                                    setTheme={this.setTheme}
                                    currentTheme={this.state.muiTheme}
                                    themeList={ThemeListNames}
                                    user_info={this.props.user_info}
                                />

                                <RouteComponent
                                    user_info={this.props.user_info}
                                    childProps={childProps}/>
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
            modalOpen: store.modal.modalOpen,

            snackbarMessage: store.snackbar.message,
            snackbarDuration: store.snackbar.duration,
            snackbarOpen: store.snackbar.snackbarOpen
        };
    })(Main)
);
