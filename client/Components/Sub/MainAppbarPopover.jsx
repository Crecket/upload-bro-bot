import React from "react";
import IconButton from "material-ui/IconButton";
import ExitToAppIcon from "material-ui/svg-icons/action/exit-to-app";
import MenuItem from "material-ui/MenuItem";
import IconMenu from "material-ui/IconMenu";
import MoreVertIcon from "material-ui/svg-icons/navigation/more-vert";
import PaletteIcon from "material-ui/svg-icons/image/palette";
import PowerIcon from "material-ui/svg-icons/action/power-settings-new";
import ManualPost from "../../Helpers/ManualPost";

export default props => {
    // generate a list of menu items
    const MenuItems = props.themeList.map(theme => {
        return (
            <MenuItem
                id={theme + " Theme"}
                primaryText={theme + " Theme"}
                onClick={props.themeSwitcher(theme)}
                checked={props.currentTheme === theme}
            />
        );
    });

    return (
        <IconMenu
            open={props.open}
            onRequestClose={props.togglePopover}
            onTouchTap={props.togglePopover}
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
                id="theme-changer-menuitem"
                primaryText="Change Theme"
                rightIcon={<PaletteIcon />}
                menuItems={MenuItems}
            />
        </IconMenu>
    );
}
