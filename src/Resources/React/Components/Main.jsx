import React from 'react';
import {connect} from "react-redux";
import Logger from '../Helpers/Logger';

// custom components
import MainAppbar from './MainAppbar';
import UserServerLookup from './UserServerLookup';
import UserList from './UserList';
import UserFullPage from './UserFullPage';
import HighscoresLookup from './HighscoresLookup';

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

import {getChampions, updateChampions} from "../actions/championActions";
import {getServers, updateServers} from "../actions/serverActions";
import {addUser, selectUser, clearUsers, removeUser, loadUsers} from "../actions/userAction";
import {openModal, closeModal} from "../actions/modalActions";

// connect to redux
@connect((store) => {
    return {
        championsFetching: store.champions.fetching,
        champions: store.champions.champions,

        serversFetching: store.servers.fetching,
        servers: store.servers.servers,

        userList: store.users.userList,
        doingLookup: store.users.doingLookup,
        selectedUser: store.users.selectedUser,

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
        // get the new server and champions list
        this.props.dispatch(getServers());
        this.props.dispatch(getChampions());

        // load any existing users from localstorage
        this.props.dispatch(loadUsers());
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
        this.props.dispatch(updateChampions());
        this.props.dispatch(updateServers());
    };

    // remove a user from the list
    removeUserHelper = (key) => {
        this.props.dispatch(removeUser(key))
    };
    // select a user and show him instead of
    selectUserHelper = (userkey) => {
        this.props.dispatch(selectUser(userkey))
    };
    // add a new user
    addUserHelper = (username, server)=> {
        this.props.dispatch(addUser(username, server));
    };
    // clear the full user list
    clearUserHelper = () => {
        this.props.dispatch(clearUsers());
    };

    render() {
        var mainBody = '';
        if (this.props.championsFetching || this.props.serversFetching) {
            mainBody = (
                <div style={{textAlign: 'center'}}>
                    <CircularProgress size={2} color="rgb(28, 142, 215)"/>
                </div>
            );
        } else if (this.props.selectedUser && this.props.userList[this.props.selectedUser]) {
            // a user is selected
            mainBody = (
                <UserFullPage
                    addUser={this.addUserHelper}
                    doingLookup={this.props.doingLookup}
                    selectUser={this.selectUserHelper}
                    championList={this.props.champions}
                    removeUser={this.removeUserHelper}
                    selectedUser={this.props.selectedUser}
                    summoner={this.props.userList[this.props.selectedUser]}
                />
            );
        } else {
            const enabledTabs = [];
            enabledTabs.push(<Tab label="Lookup" key="Lookup">
                <UserServerLookup
                    addUser={this.addUserHelper}
                    openModal={this.openModalHelper}
                    doingLookup={this.state.doingLookup}
                    serverList={this.props.servers}
                />
            </Tab>);

            enabledTabs.push(<Tab label="Recent Users" key="Recent">
                <UserList
                    selectUser={this.selectUserHelper}
                    removeUser={this.removeUserHelper}
                    clearUser={this.clearUserHelper}
                    userList={this.props.userList}
                    championList={this.props.champions}
                />
            </Tab>);

            enabledTabs.push(<Tab label="Highscores" key="Highscores">
                <HighscoresLookup
                    addUser={this.addUserHelper}
                    openModal={this.openModalHelper}
                    championList={this.props.champions}
                    targetUrl={API_URL}/>
            </Tab>);

            mainBody = (
                <Tabs>
                    {enabledTabs}
                </Tabs>
            );
        }

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

// give theme context
Main.childContextTypes = {
    muiTheme: React.PropTypes.object.isRequired,
};
export default Main;
