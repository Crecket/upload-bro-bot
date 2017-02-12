import React  from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import {blue500, lightGreenA200} from 'material-ui/styles/colors'

import Utils from '../../Helpers/Utils';
import NavLink from '../../Helpers/NavLink';

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
                Add {Utils.ucfirst(this.props.name)}
            </RaisedButton>
        );
        if (this.props.providerSite) {
            // user is logged into this site
            BlockBtn = (
                <RaisedButton
                    primary={true}
                    containerElement={<NavLink to={"/remove/" + this.props.name}/>}
                    style={styles.button}>
                    Remove {Utils.ucfirst(this.props.name)}
                </RaisedButton>
            )
        }
        return (
            <div style={styles.container}>
                <a href={this.props.urlInfo} target="_blank">
                    <img style={styles.img}
                         src={this.props.img}/>
                </a>
                <br/>

                {BlockBtn}
            </div>
        );
    };
}