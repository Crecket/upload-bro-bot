import React  from 'react';

import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import CloudUpload from 'material-ui/svg-icons/file/cloud-upload';
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

// TODO clickable icon/title to home

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
                iconElementLeft={<IconButton><CloudUpload /></IconButton>}
                iconElementRight={TopRightBtn}
            />
        );
    };
}

export default MainAppbar;