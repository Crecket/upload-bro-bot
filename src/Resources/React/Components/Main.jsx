import React from 'react';
import {connect} from "react-redux";
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

// custom components
import Logger from '../Helpers/Logger';
import MainAppbar from './MainAppbar';

// Themes
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import CustomDark from '../Themes/CustomDark';
import CustomLight from '../Themes/CustomLight';
import CustomBlue from '../Themes/CustomBlue';
const ThemesList = {
    "CustomDark": getMuiTheme(CustomDark),
    "CustomBlue": getMuiTheme(CustomBlue),
    "CustomLight": getMuiTheme(CustomLight)
};

// actions
import {openModal, closeModal} from "../Actions/modalActions.js";
import {userUpdate, userLogout} from "../Actions/user.js";
import {siteUpdate} from "../Actions/sites.js";

// connect to redux
@connect((store) => {
    return {
        sites: store.sites.sites,

        user_info: store.user.user_info,

        modalText: store.modal.message,
        modalTitle: store.modal.title,
        modalOpen: store.modal.modalOpen,
    };
})
export default class Main extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            // server connection status
            connected: false,

            // theme options
            muiTheme: 'CustomBlue',
        };

    };

    componentDidMount() {
        // update user status
        this.updateUser();

        // fetch site data
        this.siteUpdate();
    };

    // =========== Static data =============

    // change the theme
    setTheme = (setValue) => {
        if (setValue) {
            if (typeof ThemesList[setValue] !== "undefined") {
                this.setState({muiTheme: setValue});
                return true;
            }
        }
        // no custom value given or value does not exist, just toggle between dark and light
        if (this.state.muiTheme === "CustomDark") {
            this.setState({muiTheme: "CustomLight"});
        } else {
            this.setState({muiTheme: "CustomDark"});
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

        console.log(this.props.children);

        // get the children pages and give them some default props
        const mainBody = React.Children.map(
            this.props.children,
            (child) => React.cloneElement(child, {
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
                <div className={"container-fluid " + this.state.muiTheme}>
                    <div className={"row center-xs"}>
                        <div className="col-xs-12 col-md-10 col-lg-8">
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
