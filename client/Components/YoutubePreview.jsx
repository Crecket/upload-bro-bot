import React from "react";
import YouTube from "react-youtube";
import PlayArrow from "material-ui/svg-icons/av/play-arrow";
import PlayArrow1 from "material-ui/svg-icons/av/play-circle-filled";
import PlayArrow2 from "material-ui/svg-icons/av/play-circle-outline";
import PaperHelper from "./Sub/PaperHelper";
import TitleBar from "./Sub/TitleBar";

const styles = {
    wrapper: {
        marginTop: 30
    },
    playIcon: {
        minWidth: 40
    },
    playWrapper:{
        minHeight: 120
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
        this.state = {
            visible: false
        };
    }

    onPlay = () => {
        this.setState({ visible: true });
    };

    render() {
        const videoPreview = this.state.visible
            ? <div className="fluidMedia">
                  <YouTube videoId="FsN-6xlfoz4" opts={opts} />
              </div>
            : <div style={styles.playWrapper}>
                  <PlayArrow style={styles.playIcon} onTouchTap={this.onPlay} />
                  <PlayArrow1 style={styles.playIcon} onTouchTap={this.onPlay} />
                  <PlayArrow2 style={styles.playIcon} onTouchTap={this.onPlay} />
              </div>;

        return (
            <div style={styles.wrapper}>
                <PaperHelper>
                    <TitleBar>
                        Quick preview
                    </TitleBar>
                    {videoPreview}
                </PaperHelper>
            </div>
        );
    }
}
