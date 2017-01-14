import React from 'react';

import Paper from 'material-ui/Paper';
import {List, ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import HighscoreItem from './HighscoreItem';

const styles = {
    paper: {
        padding: '5px'
    },
    box: {
        margin: 'auto',
        marginTop: '10px',
        textAlign: 'left'
    },
};

class Highscores extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            selectedChampion: 0
        };
    };

    render() {
        var result = "";

        // check the length
        if (this.props.championData && Object.keys(this.props.championData).length > 0) {
            // show a list
            result = (
                <div>
                    <div className="box">
                        <h1 style={{textAlign: 'center', color: 'white'}}>
                            {this.props.championList[this.props.selectedChampion]['name']} Highscores
                        </h1>
                    </div>

                    <Paper className="box">
                        <List>
                            {/* Loop through all highscore items */}
                            {Object.keys(this.props.championData).map((key) => {
                                let tempChampion = this.props.championData[key];
                                return <HighscoreItem
                                    key={key} userKey={key}
                                    addUser={this.props.addUser}
                                    championInfo={tempChampion}
                                />;
                            })}
                        </List>
                    </Paper>
                </div>
            );
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

export default Highscores;