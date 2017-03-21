import React  from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import LinkIcon from 'material-ui/svg-icons/content/link';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import {blue500, lightGreenA200} from 'material-ui/styles/colors'

import Utils from '../../Helpers/Utils';
import NavLink from '../../Helpers/NavLink';

const styles = {
    img: {
        maxHeight: 120,
        zIndex: 5
    },
    container: {
        position: 'relative'
    },
    button: {
        width: '100%'
    },
    floatingBtn: {
        position: 'absolute',
        zIndex: 1000,
        top: 0,
        right: 0
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
                secondary={true} style={styles.button}
                href={"/login/" + this.props.siteInfo.key}>
                Add {this.props.siteInfo.name}
            </RaisedButton>
        );

        if (this.props.providerSite) {
            // user is logged into this site
            BlockBtn = (
                <RaisedButton
                    primary={true}
                    containerElement={<NavLink
                        to={"/remove/" + this.props.siteInfo.key}/>}
                    style={styles.button}>
                    Remove {Utils.ucfirst(this.props.siteInfo.name)}
                </RaisedButton>
            );
        }
        return (
            <div style={styles.container}>
                <FloatingActionButton
                    mini={true} style={styles.floatingBtn}
                    href={this.props.siteInfo.url} rel="noopener" target="_blank">
                    <LinkIcon />
                </FloatingActionButton>
                <img style={styles.img} alt={Utils.ucfirst(this.props.siteInfo.name) + " logo"}
                     src={this.props.siteInfo.logoUrl}/>
                <br/>
                {BlockBtn}
            </div>
        );
    };
}