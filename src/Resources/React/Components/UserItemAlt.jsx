import React from 'react';

import {ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';

class UserItemAlt extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    };

    selectUser = () => {
        this.props.selectUser(this.props.summonerKey);
    };

    render() {
        let summonerInfo = this.props.summoner['data']['summoner_info'];

        // ranked text fallback
        let rankedtext = summonerInfo.tier + " " + summonerInfo.division;
        if (!summonerInfo.tier || !summonerInfo.division) {
            rankedtext = "UNRANKED";
        }

        return (
            <ListItem
                primaryText={summonerInfo.name + " - " + summonerInfo.server}
                leftAvatar={<Avatar
                    src={"https://www.masterypoints.com/assets/img/lol/summoner_icons/" + summonerInfo.icon + ".png"}/>}
                secondaryText={rankedtext}
                onClick={this.selectUser}
            />
        );
    };
}

export default UserItemAlt;