import React  from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import LinkIcon from 'material-ui/svg-icons/content/link';
import FloatingActionButton from 'material-ui/FloatingActionButton';

import Utils from '../../Helpers/Utils';
import ManualPost from '../../Helpers/ManualPost';
import NavLink from '../Sub/NavLink.jsx';

const styles = {
    img: {
        height: 120,
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
        let BlockBtn;
        if (this.props.providerSite) {
            // user is logged into this site
            BlockBtn = (
                <NavLink to={"/remove/" + this.props.siteInfo.key}>
                    <RaisedButton
                        primary={true}
                        style={styles.button}>
                        Remove {this.props.siteInfo.title}
                    </RaisedButton>
                </NavLink>
            );
        } else {
            BlockBtn = (
                <RaisedButton
                    secondary={true} style={styles.button}
                    onClick={ManualPost("/login/" + this.props.siteInfo.key)}>
                    Add {this.props.siteInfo.title}
                </RaisedButton>
            );
        }

        let svgLogo = null;
        if (this.props.siteInfo && this.props.siteInfo.logos) {
            svgLogo = <img style={styles.img}
                           alt={Utils.ucfirst(this.props.siteInfo.name) + " logo"}
                           src={this.props.siteInfo.logos['svg']}/>;
        }

        return (
            <div style={styles.container}>
                <FloatingActionButton
                    mini={true} style={styles.floatingBtn}
                    href={this.props.siteInfo.url} rel="noopener" target="_blank">
                    <LinkIcon />
                </FloatingActionButton>
                {svgLogo}
                <br/>
                <br/>
                {BlockBtn}
            </div>
        );
    };
}
