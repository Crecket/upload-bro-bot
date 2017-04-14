import React from "react";
import YouTube from "react-youtube";
import PaperHelper from "./Sub/PaperHelper";
import TitleBar from "./Sub/TitleBar";

const styles = {
    wrapper: {
        marginTop: 30
    }
};

// https://developers.google.com/youtube/player_parameters
const opts = {
    playerVars: {
        autoplay: 0
    }
};

export default class YoutubePreview extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    render() {
        return (
            <div style={styles.wrapper}>
                <PaperHelper>
                    <TitleBar>
                        Quick preview
                    </TitleBar>
                    <div className="fluidMedia">
                        <YouTube videoId="FsN-6xlfoz4" opts={opts} />
                    </div>
                </PaperHelper>
            </div>
        );
    }
}
