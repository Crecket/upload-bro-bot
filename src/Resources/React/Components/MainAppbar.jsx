import React  from 'react';

import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';

import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import RefreshIcon from 'material-ui/svg-icons/navigation/refresh';
// import PaletteIcon from 'material-ui/svg-icons/image/palette';
import DesktopMacIcon from 'material-ui/svg-icons/hardware/desktop-mac';

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

    // open the extension in a new tab as full screen
    extensionInTab = () => {
        chrome.tabs.create({url: "popup.html"});
    };

    render() {
        return (
            <AppBar
                title="Mastery Points Lookup"
                style={styles.appbar}
                iconElementLeft={<img style={styles.customIcon} src="img/icon-200.png"/>}
                iconElementRight={
                    <IconMenu iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                              targetOrigin={{horizontal: 'right', vertical: 'top'}}
                              anchorOrigin={{horizontal: 'right', vertical: 'top'}}>
                        <MenuItem leftIcon={<RefreshIcon/>} primaryText="Update" onClick={this.props.updateStaticData}/>
                        <MenuItem leftIcon={<DesktopMacIcon/>} primaryText="Full Screen" onClick={this.extensionInTab}/>
                        {/*<MenuItem leftIcon={<PaletteIcon/>} primaryText="Change theme" onClick={this.props.setTheme}/>*/}
                    </IconMenu>}
            />
        );
    };
}

export default MainAppbar;