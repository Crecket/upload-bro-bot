import React from 'react';
import CloudUploadIcon from 'material-ui/svg-icons/file/cloud-upload';
import SearchIcon from 'material-ui/svg-icons/action/search';
import GroupIcon from 'material-ui/svg-icons/social/group';
import ScreenShareIcon from 'material-ui/svg-icons/communication/screen-share';

import PaperHelper from './PaperHelper';
import TitleBar from "./TitleBar";
import Center from './Center';

const styles = {
    box: {
        margin: 'auto',
        marginTop: '10px',
        padding: 5,
        textAlign: 'center',
    },
};

const featureList = [
    {
        icon: <CloudUploadIcon/>,
        title: "Instant upload",
        description: "Upload shared files from the chat directly to services such as " +
        "Google Drive, Dropbox and Imgur"
    },
    {
        icon: <SearchIcon/>,
        title: "Share files",
        description: (
            <div>
                Search and share files directly in Telegram.
                <br/>
                <strong>@uploadbro_bot google file.pdf</strong>
            </div>
        )
    },
    {
        icon: <GroupIcon/>,
        title: "Works in Groups",
        description: "Add UploadBro to a group chat or message him directly to use his features."
    },
    {
        icon: <ScreenShareIcon/>,
        title: "All platforms",
        description: "UploadBro works on all supported Telegram platforms."
    }
];

export default class FeatureList extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    };

    renderFeature(key, icon, title, description) {
        return (
            <div className="col-xs-12 col-sm-6 col-md-4 col-lg-3" key={key}>
                <PaperHelper className="box" style={styles.box}>
                    <div className="row">

                        <div className="col-xs-12 col-sm-4 col-md-3">
                            <div className="box">
                                <Center>
                                    {icon}
                                </Center>
                            </div>
                        </div>

                        <div className="col-xs-12 col-sm-8 col-md-9">
                            <div className="box">
                                <h3>{title}</h3>
                                {description}
                            </div>
                        </div>

                    </div>
                </PaperHelper>
            </div>
        );
    }

    render() {
        const featureComponents = featureList.map((value, key) => {
            return this.renderFeature(key, value.icon, value.title, value.description);
        });

        return (
            <div style={{padding: 0}}>
                <div className="row center-xs">
                    <TitleBar>
                        Features
                    </TitleBar>
                    {featureComponents}
                </div>
            </div>
        );
    };
}