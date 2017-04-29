import React from "react";
import Helmet from "react-helmet";
import RaisedButton from "material-ui/RaisedButton";
// import Markdown from 'react-markdown';

// custom components
import ProviderBlocks from "../Components/ProviderSites/ProviderBlocks";
import PaperHelper from "../Components/Sub/PaperHelper";
import ForceLogin from "../Helpers/ForceLogin";
import Logger from "../Helpers/Logger";

const styles = {
    loggedIn: {
        paddingTop: 10,
        paddingBottom: 10,
        textAlign: "center"
    }
};

export default class Dashboard extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    componentDidMount() {
        ForceLogin(this.props, true);
    }

    componentDidUpdate() {
        ForceLogin(this.props, true);
    }

    render() {
        return (
            <div>
                <Helmet>
                    <title>{`UploadBroBot - Dashboard`}</title>
                </Helmet>
                <PaperHelper style={styles.loggedIn}>
                    You're logged in as:<br />
                    {this.props.user_info.first_name}
                    {" "}
                    {this.props.user_info.last_name}
                    <br />
                    <ProviderBlocks
                        user_provider_sites={
                            this.props.user_info.provider_sites
                        }
                        provider_sites={this.props.sites}
                    />
                    <br />
                    <div className="col-xs-12 col-sm-6 col-sm-offset-3 col-md-4 col-md-offset-4">
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
                            />
                        </a>
                    </div>

                    {/*<div className="col-xs-12 col-sm-6 col-sm-offset-3 col-md-4 col-md-offset-4">*/}
                    {/*<Markdown source={this.props.sites.imgur.documentation}/>*/}
                    {/*</div>*/}

                    {/*<LoadingScreen/>*/}
                </PaperHelper>
            </div>
        );
    }
}
