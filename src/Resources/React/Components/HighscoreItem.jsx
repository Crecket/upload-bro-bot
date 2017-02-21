import React from 'react';

import {ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';

class Highscores extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            selectedChampion: 0
        };
    };

    // lookup this username and server
    doLookup = () => {
        this.props.addUser(this.props.championInfo.name, this.props.championInfo.server);
    }

    render() {
        // function to add commans to big numbers
        function numberWithCommas(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }

        return (
            <ListItem
                key={this.props.userKey} onClick={this.doLookup}
                leftAvatar={<Avatar
                    src={"https://www.masterypoints.com/assets/img/lol/summoner_icons/" +
                    this.props.championInfo.icon + ".png"}/>}
                rightAvatar={<Avatar
                    src={"https://www.masterypoints.com/assets/img/lol/mastery_icons/master" +
                    this.props.championInfo['mastery_level'] + ".png"}/>}
                primaryText={(parseInt(this.props.userKey) + 1) + ". " + this.props.championInfo.name}
                secondaryText={numberWithCommas(this.props.championInfo.points) + " - " + this.props.championInfo.server}
            />
        );
    };
}

export default Highscores;