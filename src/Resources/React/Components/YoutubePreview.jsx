import React from 'react';
import YouTube from 'react-youtube';
import PaperHelper from "../Components/PaperHelper";
import TitleBar from "../Components/TitleBar";

const styles = {
    wrapper: {
        padding: 10,
        marginTop: 30
    }
}

// https://developers.google.com/youtube/player_parameters
const opts = {
    playerVars: {
        autoplay: 0
    }
}

export default class YoutubePreview extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    };

    render() {
        return (
            <div>
                <PaperHelper style={styles.wrapper}>
                    <TitleBar>
                        Quick preview
                    </TitleBar>
                    <YouTube
                        videoId="FsN-6xlfoz4"
                        opts={opts}
                    />
                </PaperHelper>
            </div>
        );
    };
}