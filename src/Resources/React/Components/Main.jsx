import React from 'react';
import {connect} from "react-redux";
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {Tabs, Tab} from 'material-ui/Tabs';

// custom components
import Logger from '../Helpers/Logger';
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

// actions
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

        // get the children pages and give them some default props
        var mainBody = React.Children.map(
            this.props.children,
            (child) => React.cloneElement(child, {
                handleClose: this.handleClose,
                handleModalOpen: this.handleModalOpen,
                handleModalClose: this.handleModalClose
            })
        );

        return (
            <MuiThemeProvider muiTheme={ThemesList[this.state.muiTheme]}>
                <div className={"wrap " + this.state.muiTheme}
                     style={{background: ThemesList[this.state.muiTheme].bodyBackground}}>
                    <div
                        className="col-xs-12"
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
