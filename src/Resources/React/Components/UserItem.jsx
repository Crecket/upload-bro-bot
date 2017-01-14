import React from 'react';

import FlatButton from 'material-ui/FlatButton';
import {List, ListItem} from 'material-ui/List';
import {Card, CardHeader, CardText, CardActions} from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import Subheader from 'material-ui/Subheader';
import Chip from 'material-ui/Chip';

const styles = {
    paper: {
        padding: '5px',
        marginBottom: '5px'
    },
    box: {
        margin: 'auto',
        marginTop: '10px'
    },
    chip: {
        margin: '3px'
    },
    chipWrapper: {
        display: 'flex',
        flexWrap: 'wrap',
    },

}

class UserItem extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    };

    openWebsite = () => {
        let summonerInfo = this.props.summoner['data']['summoner_info'];
        chrome.tabs.create({url: "https://www.masterypoints.com/player/" + summonerInfo.name + "/" + summonerInfo.server});
    };

    removeThisUser = () => {
        this.props.removeUser(this.props.summonerKey);
    };

    selectUser = () => {
        this.props.selectUser(this.props.summonerKey);
    };

    render() {
        let added = this.props.summoner['added'];
        let summonerInfo = this.props.summoner['data']['summoner_info'];
        let summonerMastery = this.props.summoner['data']['summoner_mastery'];
        let summonerMasteryData = summonerMastery['mastery_data'];

        // ranked text fallback
        let rankedtext = summonerInfo.tier + " " + summonerInfo.division;
        if (!summonerInfo.tier || !summonerInfo.division) {
            rankedtext = "Unranked";
        }

        // function to add commans to big numbers
        function numberWithCommas(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }

        return (
            <div className="row">
                <div className="col-xs-12">
                    <div className="col-xs-12">
                        <Card style={styles.paper}>
                            <CardHeader
                                title={summonerInfo.name + " - " + summonerInfo.server}
                                avatar={"https://www.masterypoints.com/assets/img/lol/summoner_icons/" + summonerInfo.icon + ".png"}
                                subtitle={rankedtext}
                                onClick={this.selectUser}
                            />
                            <CardText expandable={true}>
                                <div style={styles.chipWrapper}>
                                    <Chip
                                        style={styles.chip}>{"Total Points: " + numberWithCommas(summonerMastery.total_points)}</Chip>
                                    <Chip
                                        style={styles.chip}>{"MasteryLevel: " + summonerMastery.total_mastery_level}</Chip>
                                    <Chip style={styles.chip}>
                                        {"Played: " + summonerMastery.total_champions + "/" + Object.keys(this.props.championList).length}
                                    </Chip>
                                    <Chip style={styles.chip}>
                                        {"Mastered: " + summonerMastery.total_mastered + "/" + Object.keys(this.props.championList).length}
                                    </Chip>
                                </div>
                                <List>
                                    <Subheader>Top 5 Champions</Subheader>
                                    {Object.keys(summonerMasteryData).map((key) => {
                                        let currentItem = summonerMasteryData[key];

                                        // check if we have a championlist and the champion is found
                                        if (this.props.championList && this.props.championList[currentItem['champion']]) {
                                            // select the champion info
                                            var championInfo = this.props.championList[currentItem['champion']];

                                            // display a championitem
                                            return <ListItem
                                                key={key}
                                                primaryText={championInfo['name'] + ": " + numberWithCommas(currentItem['points']) + " points"}
                                                secondaryText={"Level " + currentItem['mastery_level']}
                                                leftAvatar={<Avatar
                                                    src={"https://www.masterypoints.com" + championInfo['img']}/>}
                                                rightAvatar={<Avatar
                                                    src={"https://www.masterypoints.com/assets/img/lol/mastery_icons/master" + currentItem['mastery_level'] + ".png"}/>}
                                            />;
                                        }

                                        return null;
                                    })}
                                </List>
                            </CardText>
                            <CardActions expandable={true}>
                                <FlatButton label="Full Profile"
                                            onClick={this.openWebsite}/>
                                <FlatButton label="Remove"
                                            secondary={true}
                                            onClick={this.removeThisUser}
                                            style={{position: 'absolute', right: 10}}/>
                            </CardActions>
                        </Card>
                    </div>
                </div>
            </div>
        );
    };
}

export default UserItem;