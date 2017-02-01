import React  from 'react';

import NavLink from "../Helpers/NavLink";

import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import RefreshIcon from 'material-ui/svg-icons/navigation/refresh';
import PowerOffIcon from 'material-ui/svg-icons/action/power-settings-new';
import ExitToAppIcon from 'material-ui/svg-icons/action/exit-to-app';
// import IconButton from 'material-ui/IconButton';
// import IconMenu from 'material-ui/IconMenu';
// import MenuItem from 'material-ui/MenuItem';
// import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
// import PaletteIcon from 'material-ui/svg-icons/image/palette';

const styles = {
    appbar: {
        width: '100%',
    },
    customIcon: {
        height: '32px',
        width: '32px',
        marginTop: '9px',
        marginLeft: '4px'
    }
};

class MainAppbar extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    };

    render() {
        var TopRightBtn = (
            <FlatButton secondary={true} label="Login"
                        labelPosition="before" icon={<ExitToAppIcon/>}
                        containerElement={<NavLink to="/login"/>}/>
        );
        if (this.props.user_info) {
            TopRightBtn = (
                <FlatButton label="" labelPosition="before"
                            icon={<PowerOffIcon/>}/>
            )
        }

        return (
            <AppBar
                title="UploadyBot"
                style={styles.appbar}
                iconElementLeft={<img style={styles.customIcon} src="/assets/img/icon-200.png"/>}
                iconElementRight={TopRightBtn}
            />
        );
    };
}

export default MainAppbar;