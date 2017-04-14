import React from "react";
import AppBar from "material-ui/AppBar";
import IconButton from "material-ui/IconButton";
import ExitToAppIcon from "material-ui/svg-icons/action/exit-to-app";
import MenuItem from "material-ui/MenuItem";
import Popover from "material-ui/Popover";
import IconMenu from "material-ui/IconMenu";
import MoreVertIcon from "material-ui/svg-icons/navigation/more-vert";
import PaletteIcon from "material-ui/svg-icons/image/palette";
import PowerIcon from "material-ui/svg-icons/action/power-settings-new";

import { userLogout } from "../Actions/user.js";
import ManualPost from "../Helpers/ManualPost";

const PopoverMenu = props => (
    <IconMenu
        iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
        targetOrigin={{ horizontal: "right", vertical: "bottom" }}
        anchorOrigin={{ horizontal: "right", vertical: "top" }}
    >
        {props.loggedIn
            ? <MenuItem
                  primaryText="Logout"
                  rightIcon={<PowerIcon />}
                  onClick={props.logoutUser}
              />
            : <MenuItem
                  primaryText="Login"
                  rightIcon={<ExitToAppIcon />}
                  onClick={ManualPost("/login/telegram")}
              />}
        <MenuItem
            primaryText="Change Theme"
            rightIcon={<PaletteIcon />}
            menuItems={props.menuItems}
        />
    </IconMenu>
);

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
            showPopover: false
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

    render() {
        const MenuItems = this.props.themeList.map(theme => {
            return (
                <MenuItem
                    primaryText={theme + " Theme"}
                    onClick={this.themeSwitcher(theme)}
                    checked={this.props.currentTheme === theme}
                />
            );
        });

        return (
            <AppBar
                title="UploadBro"
                style={styles.appbar}
                iconElementLeft={
                    <IconButton>
                        <img src="/favicon-32x32.png" alt="App bar logo" />
                    </IconButton>
                }
                iconElementRight={
                    <PopoverMenu
                        menuItems={MenuItems}
                        logoutUser={this.logoutUser}
                        loggedIn={!!this.props.user_info}
                    />
                }
            >
                <Popover
                    anchorEl={this.state.anchorEl}
                    anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
                    targetOrigin={{ horizontal: "left", vertical: "top" }}
                />
            </AppBar>
        );
    }
}

export default MainAppbar;
