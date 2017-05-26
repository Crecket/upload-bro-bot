import React from "react";
import YouTube from "react-youtube";
import PlayArrow from "material-ui/svg-icons/av/play-arrow";
import FloatingActionButton from "material-ui/FloatingActionButton";
import Paper from "material-ui/Paper";
import TitleBar from "./Sub/TitleBar";

const styles = {
    wrapper: {
        marginTop: 30
    },
    playIcon: {
        minWidth: 40
    },
    playWrapper: {
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
        // the fadein enabled video wrapper
        const VideoContainer = (
            <div className="fluidMedia" key="videopreview">
                <YouTube videoId="FsN-6xlfoz4" opts={opts} />
            </div>
        );

        // the buttons
        const PlayButtons = (
            <div style={styles.playWrapper} key="playbuttons">
                <FloatingActionButton aria-label="Display a youtube video preview">
                    <PlayArrow
                        style={styles.playIcon}
                        onTouchTap={this.onPlay}
                    />
                </FloatingActionButton>
            </div>
        );

        // show buttons or play buttons
        const VideoPreview = this.state.visible ? VideoContainer : PlayButtons;

        return (
            <div style={styles.wrapper}>
                <Paper>
                    <TitleBar>
                        File upload preview
                    </TitleBar>
                    {VideoPreview}
                </Paper>
            </div>
        );
    }
}
