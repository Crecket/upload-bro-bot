import React from 'react';
import {connect} from "react-redux";
import Logger from '../Helpers/Logger';

// custom components
import MainAppbar from './MainAppbar';

// Themes
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import CustomDark from '../Themes/CustomDark';
import CustomLight from '../Themes/CustomLight';
// theme list so we can access them more easily
const ThemesList = {
    "CustomDark": getMuiTheme(CustomDark),
    "CustomLight": getMuiTheme(CustomLight)
};

// material-ui components
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {Tabs, Tab} from 'material-ui/Tabs';
import CircularProgress from 'material-ui/CircularProgress';

import {openModal, closeModal} from "../actions/modalActions";

// connect to redux
@connect((store) => {
    return {
        modalText: store.modal.message,
        modalTitle: store.modal.title,
        modalOpen: store.modal.modalOpen,
    };
})
class Main extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            // server connection status
            connected: false,

            // theme options
            muiTheme: 'CustomDark',
        };

    };

    componentDidMount() {

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

    // update our static data
    updateStaticData = () => {
    };

    render() {
        var mainBody = '';

        return (
            <MuiThemeProvider muiTheme={ThemesList[this.state.muiTheme]}>
                <div className={"wrap " + this.state.muiTheme}
                     style={{background: ThemesList[this.state.muiTheme].bodyBackground}}>
                    <div
                        className="col-xs-12 col-sm-10 col-sm-offset-1 col-md-8 col-md-offset-2 col-lg-6 col-lg-offset-3"
                        style={{paddingLeft: 0, paddingRight: 0}}>
                        <div className="content">
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
                                updateStaticData={this.updateStaticData}
                            />

                            {mainBody}
                        </div>
                    </div>
                </div>
            </MuiThemeProvider>
        )
    };
}

export default Main;
