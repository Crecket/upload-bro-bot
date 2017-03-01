import React from 'react';
import PaperHelper from "../Components/PaperHelper";
import YouTube from 'react-youtube';

const styles = {
    wrapper: {
        padding: 10
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
                <h1>Quick preview</h1>
                <PaperHelper style={styles.wrapper}>
                    <YouTube
                        videoId="FsN-6xlfoz4"
                        opts={opts}
                    />
                </PaperHelper>
            </div>
        );
    };
}