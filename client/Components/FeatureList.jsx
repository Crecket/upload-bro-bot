import React from "react";
import Paper from "material-ui/Paper";
import muiThemeable from "material-ui/styles/muiThemeable";
import CloudUploadIcon from "material-ui/svg-icons/file/cloud-upload";
import SearchIcon from "material-ui/svg-icons/action/search";
import GroupIcon from "material-ui/svg-icons/social/group";
import DesktopWindowsIcon from "material-ui/svg-icons/hardware/desktop-windows";

import TitleBar from "./Sub/TitleBar";
import Center from "./Sub/Center";

const styles = {
    wrapper: {
        marginTop: 30
    },
    box: {
        marginTop: 10,
        width: "100%",
        padding: 5,
        textAlign: "center"
    },
    colwrapper: {
        display: "flex"
    },
    icon: {
        height: 60,
        width: 60
    }
};

class FeatureList extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    renderFeature(key, icon, title, description) {
        return (
            <div
                className="col-xs-12 col-sm-6 col-md-4 col-lg-3"
                key={key}
                style={styles.colwrapper}
            >
                <Paper className="box" style={styles.box}>
                    <div className="row">
                        <div className="col-xs-12 col-sm-4">
                            <Center>
                                {icon}
                            </Center>
                        </div>

                        <div className="col-xs-12 col-sm-8">
                            <div className="box">
                                <h3>
                                    {title}
                                </h3>
                                {description}
                            </div>
                        </div>
                    </div>
                </Paper>
            </div>
        );
    }

    render() {
        // icon helper
        const iconStyle = Object.assign(styles.icon, {
            color: this.props.muiTheme.palette.primary2Color
        });

        // list of features
        const featureList = [
            {
                icon: <CloudUploadIcon style={iconStyle} />,
                title: "Instant upload",
                description:
                    "Upload files from the chat directly to other services."
            },
            {
                icon: <SearchIcon style={iconStyle} />,
                title: "Share files",
                description:
                    "Search for files and share them directly in Telegram."
            },
            {
                icon: <GroupIcon style={iconStyle} />,
                title: "Works in groups",
                description:
                    "Just right click the file and forward it to UploadBro."
            },
            {
                icon: <DesktopWindowsIcon style={iconStyle} />,
                title: "All platforms",
                description: "UploadBro supports all Telegram's platforms."
            }
        ];

        const featureComponents = featureList.map((value, key) => {
            return this.renderFeature(
                key,
                value.icon,
                value.title,
                value.description
            );
        });

        return (
            <div style={styles.wrapper}>
                <div className="row center-xs">
                    <div className="col-xs-12">
                        <Paper className="box">
                            <TitleBar>Features</TitleBar>
                        </Paper>
                    </div>
                    {featureComponents}
                </div>
            </div>
        );
    }
}

export default muiThemeable()(FeatureList);
