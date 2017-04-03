import React from 'react';
import {connect} from "react-redux";
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import store from 'store';
// import {RouteTransition} from 'react-router-transition';

// custom components
import ComponentLoader from './Sub/ComponentLoader'
import Logger from '../Helpers/Logger'

// only allow this in debug enviroment, else return null
const MainAppbar = ComponentLoader(
    () => import('./MainAppbar'), () => require.resolveWeak('./MainAppbar'));
// only allow this in debug enviroment, else return null
const DrawerDebugger = ComponentLoader(
    () => import('./DrawerDebugger'), () => require.resolveWeak('./DrawerDebugger'));

// Themes
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import LightBlue from '../Themes/LightBlue';
import Dark from '../Themes/Dark';

// navigator fallback for server-side rendering
const navigatorHelper = (typeof navigator !== "undefined" && navigator.userAgent) ? navigator.userAgent : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36";
const ThemesList = {
    "LightBlue": getMuiTheme(LightBlue, {userAgent: navigatorHelper}),
    "Dark": getMuiTheme(Dark, {userAgent: navigatorHelper}),
};
const ThemeListNames = Object.keys(ThemesList);

// actions
import {openModal, closeModal} from "../Actions/modalActions.js";
import {userUpdate, userLogout, userLoadLocalstorage} from "../Actions/user.js";
import {siteUpdate, siteLoadLocalstorage} from "../Actions/sites.js";

// connect to redux
@connect((store) => {
    return {
        sites: store.sites.sites,

        user_info: store.user.user_info,
        initialCheck: store.user.initialCheck,

        modalText: store.modal.message,
        modalTitle: store.modal.title,
        modalOpen: store.modal.modalOpen,
    };
})
export default class Main extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            // theme options
            muiTheme: store.get('theme') || "Dark", // default to dark
        };
    };

    componentDidMount() {
        // initial localstorage check
        this.props.dispatch(userLoadLocalstorage());
        this.props.dispatch(siteLoadLocalstorage());

        // update user status
        this.updateUser();

        // fetch site data
        this.props.dispatch(siteUpdate());
    };

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
        this.setState({muiTheme: finalTheme}, () => {
            store.set('theme', finalTheme);
        })
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
        // get the children pages and give them some default props
        const mainBody = React.Children.map(
            this.props.children,
            (child) => React.cloneElement(child, {
                initialCheck: this.props.initialCheck,
                user_info: this.props.user_info,
                sites: this.props.sites,
                theme: ThemesList[this.state.muiTheme],
                updateUser: this.updateUser,
                openModalHelper: this.openModalHelper,
                closeModalHelper: this.closeModalHelper
            })
        );

        return (
            <MuiThemeProvider muiTheme={ThemesList[this.state.muiTheme]}>
                <div className={"container-fluid react-root " + this.state.muiTheme} style={{
                    backgroundColor: ThemesList[this.state.muiTheme].rawTheme.palette.appBackgroundColor
                }}>
                    <div className={"row center-xs"}>
                        <div className="col-xs-12 col-md-12 col-lg-10">
                            <div className="box"
                                 style={{paddingBottom: 30, position: 'relative'}}>
                                <Dialog
                                    title={this.props.modalTitle}
                                    actions={[
                                        <FlatButton
                                            label="Ok"
                                            primary={true}
                                            keyboardFocused={true}
                                            onTouchTap={this.closeModalHelper}
                                        />,
                                    ]}
                                    modal={false}
                                    open={this.props.modalOpen}
                                    onRequestClose={this.closeModalHelper}
                                >
                                    {this.props.modalText}
                                </Dialog>

                                {/*<DrawerDebugger theme={ThemesList[this.state.muiTheme]}/>*/}

                                <MainAppbar
                                    setTheme={this.setTheme}
                                    currentTheme={this.state.muiTheme}
                                    themeList={ThemeListNames}
                                    user_info={this.props.user_info}
                                    updateStaticData={this.updateStaticData}
                                    logoutUser={this.logoutUser}
                                />

                                {/*<RouteTransition*/}
                                {/*pathname={this.props.location.pathname}*/}
                                {/*runOnMount={false}*/}
                                {/*atEnter={{opacity: 0}}*/}
                                {/*atLeave={{opacity: 2}}*/}
                                {/*atActive={{opacity: 1}}*/}
                                {/*mapStyles={styles => {*/}
                                {/*if (styles.opacity > 1) {*/}
                                {/*return {display: 'none'}*/}
                                {/*}*/}
                                {/*return {opacity: styles.opacity, display: 'block'}*/}
                                {/*}}></RouteTransition>*/}
                                {mainBody}
                            </div>
                        </div>
                    </div>
                </div>
            </MuiThemeProvider>
        )
    };
}
