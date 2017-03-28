import React from 'react';
import {connect} from "react-redux";
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";

// custom components
import ComponentLoader from './Sub/ComponentLoader';

// load the required components
const MainAppbar = ComponentLoader(
    () => import('./MainAppbar'), () => require.resolveWeak('./MainAppbar'));

// only allow this in debug enviroment, else return null
const DrawerDebugger = process.env.DEBUG ? ComponentLoader(
    () => import('./DrawerDebugger'), () => require.resolveWeak('./DrawerDebugger')) : null;

// Themes
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import CustomBlue from '../Themes/CustomBlue';
import CustomDark from '../Themes/CustomDark';
import Purple from '../Themes/Purple';
const ThemesList = {
    "CustomBlue": getMuiTheme(CustomBlue),
    "CustomDark": getMuiTheme(CustomDark),
    "Purple": getMuiTheme(Purple),
};

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
            muiTheme: 'CustomDark',
        };
    };

    componentDidMount() {
        // initial localstorage check
        this.props.dispatch(userLoadLocalstorage());
        this.props.dispatch(siteLoadLocalstorage());

        // update user status
        this.updateUser();

        // fetch site data
        this.siteUpdate();

        window.setThemeTest = this.setTheme;
    };

    // =========== Static data =============

    // change the theme
    setTheme = (theme = false) => {
        if (theme && typeof ThemesList[theme] !== "undefined") {
            this.setState({muiTheme: theme});
            return true;
        }

        // no custom value given or value does not exist, just toggle between dark and light
        if (this.state.muiTheme === "CustomBlue") {
            this.setState({muiTheme: "CustomDark"});
        } else {
            this.setState({muiTheme: "CustomBlue"});
        }
    };

    // open the general modal
    openModalHelper = (message, title) => {
        this.props.dispatch(openModal(message, title));
    };

    // close the general modal
    closeModalHelper = () => {
        this.props.dispatch(closeModal());
    };

    // update provider info
    siteUpdate = () => {
        this.props.dispatch(siteUpdate());
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
                                 style={{paddingBottom: 30}}>
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

                                <DrawerDebugger theme={ThemesList[this.state.muiTheme]}/>

                                <MainAppbar
                                    setTheme={this.setTheme}
                                    user_info={this.props.user_info}
                                    updateStaticData={this.updateStaticData}
                                    logoutUser={this.logoutUser}
                                />

                                {mainBody}
                            </div>
                        </div>
                    </div>
                </div>
            </MuiThemeProvider>
        )
    };
}
