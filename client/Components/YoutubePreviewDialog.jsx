import React from "react";
import YouTube from "react-youtube";
import Dialog from "material-ui/Dialog";

const styles = {
    dialog: {
        content: {
            width: "100%",
            maxWidth: "none"
        }
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
            open: false
        };
    }

    render() {
        return (
            <Dialog
                contentStyle={styles.dialog.content}
                className="col-xs-12 col-md-10 col-md-offset-1 col-lg-8 col-lg-offset-2"
                title="Dialog With Actions"
                modal={true}
                open={true}
            >
                <div className="fluidMedia">
                    <YouTube videoId="FsN-6xlfoz4" opts={opts}/>
                </div>
            </Dialog>
        );
    }
}
