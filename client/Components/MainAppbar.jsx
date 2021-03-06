import React from "react";
import { NavLink } from "react-router-dom";
import AppBar from "material-ui/AppBar";
import IconButton from "material-ui/IconButton";

import MainAppbarPopover from "./Sub/MainAppbarPopover";
import { userLogout } from "../Actions/user.js";

const styles = {
    appbar: {
        width: "100%"
    },
    customIcon: {
        height: "32px",
        width: "32px",
        marginTop: "9px",
        marginLeft: "4px"
    }
};

class MainAppbar extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            open: false
        };
    }

    // function that returns a setTheme function
    themeSwitcher = theme => {
        return () => {
            this.props.setTheme(theme);
        };
    };

    // logout request
    logoutUser = () => {
        this.props.dispatch(userLogout());
    };

    // menu handlers
    setMenuState = open => this.setState({ open: open });

    render() {
        return (
            <AppBar
                title="UploadBro"
                style={styles.appbar}
                iconElementLeft={
                    <IconButton
                        aria-label="Navigate to home"
                        containerElement={<NavLink to={"/dashboard"} />}
                    >
                        <img src="/favicon-32x32.png" alt="App bar logo" />
                    </IconButton>
                }
                iconElementRight={
                    <MainAppbarPopover
                        open={this.state.open}
                        setMenuState={this.setMenuState}
                        themeSwitcher={this.themeSwitcher}
                        themeList={this.props.themeList}
                        currentTheme={this.props.currentTheme}
                        logoutUser={this.logoutUser}
                        loggedIn={!!this.props.user_info}
                    />
                }
            />
        );
    }
}

export default MainAppbar;
