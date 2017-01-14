import React from 'react';
import Logger from '../Helpers/Logger.js';

import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import {fullWhite} from 'material-ui/styles/colors';
import RefreshIndicator from 'material-ui/RefreshIndicator';

import SearchIcon from 'material-ui/svg-icons/action/search';

const styles = {
    paper: {
        padding: '5px'
    },
    box: {
        margin: 'auto',
        marginTop: '10px'
    },
    container: {
        position: 'relative',
    },
    refresh: {
        display: 'inline-block',
        position: 'relative',
    },
    hintStlye: {
        color: fullWhite,
    },
};

class UserServerLookup extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            server: "euw",
            username: ""
        };
    };

    // handle input changes
    handleServerChange = (event, index, value) => this.setState({server: value});
    handleNameChange = (event) => {
        this.setState({
            username: event.target.value,
        });
    };
    handleSubmit = (e) => {
        e.preventDefault();
        var username = this.state.username;
        var server = this.state.server;

        // clear input
        this.refs.summoner_name_input.setState({value: ""});

        // log it
        Logger.log(this.refs.summoner_name_input);

        // check username
        if (username.length > 3 && username.length < 30) {
            this.props.addUser(username, server);
        }
    };

    render() {
        var fn = this;

        var lookupBtn = (
            <RaisedButton
                label="Lookup Summoner"
                labelPosition="before"
                onClick={this.handleSubmit}
                primary={true}
                icon={<SearchIcon />}
            />
        );

        if (this.props.doingLookup) {
            lookupBtn = (
                <RefreshIndicator
                    loadingColor="#FF9800"
                    size={40} left={10} top={0}
                    status="loading" style={styles.refresh}
                />
            );
        }

        return (
            <div className="row center-xs center-md" style={styles.box}>
                <div className="col-xs-12 col-md-8 ">
                    <div className="box">
                        <Paper style={styles.paper}>
                            <form onSubmit={this.handleSubmit}>
                                <h2>Lookup summoner information</h2>
                                <TextField
                                    ref="summoner_name_input"
                                    onChange={this.handleNameChange}
                                    value={this.state.username}
                                    hintText="Summoner name"
                                    hintStyle={styles.hintStlye}
                                    type="text" required autoFocus/>
                                <br />
                                <SelectField
                                    style={{textAlign: 'left'}}
                                    value={this.state.server}
                                    onChange={this.handleServerChange}
                                    required>
                                    {Object.keys(this.props.serverList).map(function (key) {
                                        return <MenuItem
                                            key={key} value={key}
                                            primaryText={fn.props.serverList[key]['slug'].toUpperCase()}/>;
                                    })}
                                </SelectField>
                                <br />
                                {lookupBtn}
                            </form>
                        </Paper>
                    </div>
                </div>
            </div>
        );
    };
}

export default UserServerLookup;