import React from 'react';
import {connect} from "react-redux";

// import Logger from '../Helpers/Logger';
import Highscores from './Highscores';

import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import SelectField from 'material-ui/SelectField';
import LinearProgress from 'material-ui/LinearProgress';
import MenuItem from 'material-ui/MenuItem';
import {fullWhite} from 'material-ui/styles/colors';
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

import {lookupHighscores, selectChampion} from "../Actions/highscoreActions";

// connect to redux
@connect((store) => {
    return {
        selectedChampion: store.highscores.selectedChampion,
        championData: store.highscores.championData,
        doingLookup: store.highscores.doingLookup
    };
})
class HighscoresLookup extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
        };
    };

    // handle input changes
    handleChampionChange = (event, index, value) => {
        this.props.dispatch(selectChampion(value));
    }
    handleSubmit = (e) => {
        e.preventDefault();
        if (!this.props.doingLookup) {
            this.props.dispatch(lookupHighscores(this.props.selectedChampion));
        }
    };

    render() {
        // show button or a loading animation
        var lookupBtn = (
            <RaisedButton
                label="Lookup Champion"
                labelPosition="before"
                onClick={this.handleSubmit}
                primary={true}
                icon={<SearchIcon />}
            />
        );
        if (this.props.doingLookup) {
            lookupBtn = (
                <div>
                    <p>Loading</p>
                    <LinearProgress mode="indeterminate" color="#1C8ED7"/>
                </div>
            );
        }

        return (
            <div>
                <div className="row center-xs center-md" style={styles.box}>
                    <div className="col-xs-12 col-md-8">
                        <div className="box">
                            <Paper style={styles.paper}>
                                <form onSubmit={this.handleSubmit}>
                                    <h2>Lookup champion highscores</h2>
                                    <SelectField
                                        onChange={this.handleChampionChange}
                                        style={{textAlign: 'left'}}
                                        value={this.props.selectedChampion}
                                        required>
                                        {Object.keys(this.props.championList).map((key) => {
                                            return <MenuItem
                                                key={key} value={key}
                                                primaryText={this.props.championList[key]['name']}/>;
                                        })}
                                    </SelectField>
                                    <br />
                                    {lookupBtn}
                                </form>
                            </Paper>
                        </div>
                    </div>
                </div>
                <div className="row" style={styles.box}>
                    <div className="col-xs-12">
                        <Highscores
                            addUser={this.props.addUser}
                            selectedChampion={this.props.selectedChampion}
                            championList={this.props.championList}
                            championData={this.props.championData}
                        />
                    </div>
                </div>
            </div>
        );
    };
}

export default HighscoresLookup;