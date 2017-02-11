import React  from 'react';

import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import PowerOffIcon from 'material-ui/svg-icons/action/power-settings-new';
import ExitToAppIcon from 'material-ui/svg-icons/action/exit-to-app';

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
            <FlatButton secondary={true}
                        label="Login"
                        labelPosition="before"
                        icon={<ExitToAppIcon/>}
                        href="/login/telegram"/>
        );
        if (this.props.user_info) {
            TopRightBtn = (
                <FlatButton label="Logout"
                            labelPosition="before"
                            onClick={this.props.logoutUser}/>
            )
        }

        return (
            <AppBar
                title="UploadBroBot"
                style={styles.appbar}
                iconElementLeft={<img style={styles.customIcon} src="/assets/img/logo-64.png"/>}
                iconElementRight={TopRightBtn}
            />
        );
    };
}

export default MainAppbar;