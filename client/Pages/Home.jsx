import React from "react";
import Helmet from "react-helmet";
import RaisedButton from "material-ui/RaisedButton";
// custom components
import ManualPost from "../Helpers/ManualPost";
import PaperHelper from "../Components/Sub/PaperHelper";
// make sync
import FeatureList from "../Components/FeatureList.jsx";
import YoutubePreview from "../Components/YoutubePreview.jsx";
import SiteList from "../Components/SiteList.jsx";

const styles = {
    centerBox: {
        alignContent: "center",
        alignItems: "center",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "row",
        flexWrap: "nowrap",
        justifyContent: "center"
    },
    notLoggedIn: {
        textAlign: "center",
        minHeight: 200
    }
};

export default class Home extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    render() {
        return (
            <div>
                <Helmet>
                    <title>{`UploadBroBot - Home`}</title>
                </Helmet>
                <PaperHelper
                    style={Object.assign(styles.notLoggedIn, styles.centerBox)}
                >
                    <RaisedButton
                        onClick={ManualPost("/login/telegram")}
                        primary={true}
                        label="Login with Telegram"
                    />
                </PaperHelper>

                <FeatureList />
                <SiteList sites={this.props.sites}/>
                <YoutubePreview />
            </div>
        );
    }
}
