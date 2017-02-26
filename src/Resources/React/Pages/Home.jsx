import React from "react";
import FlatButton from "material-ui/FlatButton";

import ProviderBlocks from "../Components/ProviderSites/ProviderBlocks";
import IntroductionScreen from "../Components/IntroductionScreen";
import NavLink from "../Helpers/NavLink";
// import Trend from 'react-trend';

const styles = {
    wrapper: {
        padding: 30,
        // color: 'white'
    },
    notLoggedIn: {
        textAlign: 'center'
    }
}

class Home extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            testData: new Array(10).fill(0)
        };
    };

    componentDidMount() {
        // setInterval(() => {
        //     this.addItem(this.getRandomInt(1, 100));
        // }, 500);
    }

    // getRandomInt = (min, max) => {
    //     return Math.floor(Math.random() * (max - min + 1)) + min;
    // }
    //
    // addItem = (val) => {
    //     let newList = this.state.testData.concat([]);
    //     newList.shift();
    //     newList.push(val);
    //     this.setState({testData: newList});
    // }

    render() {
        console.log(this.state.testData);
        var homeDiv = (
            <div style={styles.notLoggedIn}>
                You're not logged in yet. <br/>
                <FlatButton
                    secondary={true}
                    label="Login with Telegram"
                    href="/login/telegram"/>
            </div>
        );
        if (this.props.user_info) {
            homeDiv = (
                <div>
                    <div className="row center-xs">
                        <div className="box">
                            You're logged in as:<br/>
                            {this.props.user_info.username}<br/>
                            {this.props.user_info.first_name} {this.props.user_info.last_name}
                        </div>
                    </div>
                    <ProviderBlocks
                        provider_sites={this.props.user_info.provider_sites}
                        provider_sites_info={this.props.sites}
                    />

                    {/*<Trend*/}
                    {/*smooth autoDraw*/}
                    {/*data={this.state.testData}*/}
                    {/*gradient={['#42b3f4']}*/}
                    {/*radius={2}*/}
                    {/*strokeWidth={3}*/}
                    {/*strokeLinecap={'round'}*/}
                    {/*/>*/}
                </div>
            );
        }

        return (
            <div style={styles.wrapper}>
                {/*<IntroductionScreen/>*/}
                {homeDiv}
            </div>
        );
    };
}

export default Home;