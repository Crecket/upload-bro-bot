import React from "react";
import Helmet from "react-helmet";
import RaisedButton from "material-ui/RaisedButton";
import Paper from "material-ui/Paper";
// import Typist from "react-typist";
// custom components
import ManualPost from "../Helpers/ManualPost";
// make sync
import FeatureList from "../Components/FeatureList";
import YoutubePreview from "../Components/YoutubePreview";
import SiteList from "../Components/SiteList";

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
                <Paper
                    style={Object.assign(styles.notLoggedIn, styles.centerBox)}
                >
                    <RaisedButton
                        onClick={ManualPost("/login/telegram")}
                        primary={true}
                        label="Login with Telegram"
                    />
                </Paper>

                <FeatureList />
                <SiteList sites={this.props.sites} />
                <YoutubePreview />

                <div className="row center-xs">
                    <div className="col-xs-12 col-sm-6">
                        <div className="box">
                            <br />
                            <a
                                href="https://telegram.me/uploadbro_bot"
                                rel="noopener"
                                target="_blank"
                            >
                                <RaisedButton
                                    icon={
                                        <img
                                            src="/assets/img/telegram.svg"
                                            style={{ width: 32 }}
                                        />
                                    }
                                    label="message uploadbro"
                                />
                            </a>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}
