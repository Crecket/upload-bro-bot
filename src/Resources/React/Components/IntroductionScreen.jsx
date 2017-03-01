import React from "react";
import {AutoRotatingCarousel, Slide} from 'material-auto-rotating-carousel'
import {green400, green600, blue400, blue600, red400, red600} from 'material-ui/styles/colors'

const styles = {}

export default class IntroductionScreen extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            open: true
        };
    };

    closeCarousel = () => {
        this.setState({
            open: !this.state.open
        });
    }

    startEvent = () => {
        this.closeCarousel();
    }

    render() {
        return (
            <AutoRotatingCarousel
                label="Get started"
                open={this.state.open}
                onRequestClose={this.closeCarousel}
                onStart={this.startEvent}
                autoplay={false}
            >
                <Slide
                    media={<img src="/assets/img/imgur.png"/>}
                    mediaBackgroundStyle={{backgroundColor: red400}}
                    contentStyle={{backgroundColor: red600}}
                    title="This is a very cool feature"
                    subtitle="Just using this will blow your mind."
                />
                <Slide
                    media={<img src="/assets/img/imgur.png"/>}
                    mediaBackgroundStyle={{backgroundColor: blue400}}
                    contentStyle={{backgroundColor: blue600}}
                    title="Ever wanted to be popular?"
                    subtitle="Well just mix two colors and your are good to go!"
                />
                <Slide
                    media={<img src="/assets/img/imgur.png"/>}
                    mediaBackgroundStyle={{backgroundColor: green400}}
                    contentStyle={{backgroundColor: green600}}
                    title="May the force be with you"
                    subtitle="The Force is a metaphysical and ubiquitous power in the Star Wars universe."
                />
            </AutoRotatingCarousel>
        );
    };
}