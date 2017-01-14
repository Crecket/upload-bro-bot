import React from 'react';
import Logger from '../Helpers/Logger';

import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import {List, ListItem} from 'material-ui/List';
import {Card, CardHeader, CardText, CardActions} from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import Subheader from 'material-ui/Subheader';
import Chip from 'material-ui/Chip';
import RefreshIcon from 'material-ui/svg-icons/navigation/refresh';
import RefreshIndicator from 'material-ui/RefreshIndicator';

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
    floatingBtn: {
        position: 'absolute',
        top: -55,
        right: 10
    },
    refresh: {
        display: 'inline-block',
        position: 'relative',
    },
}

class UserItem extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    };

    // open the user profile
    openWebsite = () => {
        let summonerInfo = this.props.summoner['data']['summoner_info'];
        chrome.tabs.create({url: "https://www.masterypoints.com/player/" + summonerInfo.name + "/" + summonerInfo.server});
    };

    // select no one
    unsetSelectUser = () => {
        this.props.selectUser(false);
    };

    // lookup this username and server
    refreshUserInfo = () => {
        this.props.addUser(
            this.props.summoner['data']['summoner_info']['name'].toLowerCase(),
            this.props.summoner['data']['summoner_info']['server'].toLowerCase()
        );
    }

    // remove this user from the storage
    removeUserHelper = () => {
        this.props.removeUser(this.props.selectedUser);
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

        var floatElement = (
            <FloatingActionButton mini={true} onClick={this.refreshUserInfo}>
                <RefreshIcon />
            </FloatingActionButton>
        );
        if (this.props.doingLookup) {
            floatElement = <RefreshIndicator
                loadingColor="#FF9800"
                size={40} left={10} top={0}
                status="loading" style={styles.refresh}
            />;
        }

        return (
            <Card style={styles.paper}>
                <CardHeader
                    title={summonerInfo.name + " - " + summonerInfo.server}
                    avatar={"https://www.masterypoints.com/assets/img/lol/summoner_icons/" + summonerInfo.icon + ".png"}
                    subtitle={rankedtext}
                />
                <CardText expandable={false} style={{position: 'relative'}}>
                    <div style={styles.floatingBtn}>
                        {floatElement}
                    </div>

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
                    <br />

                    <FlatButton label="Full Profile"
                                onClick={this.openWebsite}/>
                    <FlatButton label="Remove"
                                secondary={true}
                                onClick={this.removeUserHelper}
                                style={{position: 'absolute', right: 110}}/>
                    <FlatButton label="Back"
                                onClick={this.unsetSelectUser}
                                style={{position: 'absolute', right: 10}}/>
                </CardText>
            </Card>
        );
    };
}

export default UserItem;