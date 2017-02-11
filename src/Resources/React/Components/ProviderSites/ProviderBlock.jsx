import React  from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import HelpIcon from 'material-ui/svg-icons/action/help';
import {green400, green600, blue400, blue600, red400, red600} from 'material-ui/styles/colors'

const styles = {
    img: {
        // maxWidth: 120,
        maxHeight: 120
    },
    button: {
        width: '100%'
    }
}

export default class ProviderBlock extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    };

    render() {

        let BlockBtn = (
            <RaisedButton
                secondary={true}
                href={this.props.url}
                style={styles.button}>
                Login
            </RaisedButton>
        );
        if (this.props.providerSite) {
            // user is logged into this site
            BlockBtn = (
                <RaisedButton
                    backgroundColor={green400}
                    style={styles.button}>
                    Logout
                </RaisedButton>
            )
        }
        return (
            <div style={styles.container}>
                <a href={this.props.urlInfo}>
                    <img style={styles.img}
                         src={this.props.img}/>
                </a>
                <br/>

                {BlockBtn}
            </div>
        );
    };
}