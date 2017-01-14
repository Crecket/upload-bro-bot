import React from 'react';
import {connect} from "react-redux";

import {List} from 'material-ui/List';
import UserItemAlt from './UserItemAlt'
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';

const styles = {
    paper: {
        padding: '5px',
        marginBottom: '15px'
    },
    box: {
        margin: 'auto',
        marginTop: '10px'
    }
}

class UserList extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    };

    render() {
        var result = "";

        // only display users if we have the championlist
        if(this.props.championList){
            // check the length
            if (Object.keys(this.props.userList).length > 0) {
                // show a list
                result = <Paper className="box">
                    <List>
                        {/* Loop through all user items */}
                        {Object.keys(this.props.userList).reverse().map((key) => {
                            let tempUser = this.props.userList[key];
                            return <UserItemAlt
                                selectUser={this.props.selectUser}
                                championList={this.props.championList}
                                removeUser={this.props.removeUser}
                                summonerKey={key}
                                key={key}
                                summoner={tempUser}
                            />;
                        })}
                    </List>
                    <RaisedButton label="Reset List" primary={true}
                                  onClick={this.props.clearUser} />
                </Paper>;
            }
        }

        return (
            <div className="row" style={styles.box}>
                <div className="col-xs-12 col-sm-10 col-sm-offset-1 col-md-8 col-md-offset-2">
                    {result}
                </div>
            </div>
        );
    };
}

export default UserList;