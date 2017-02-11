import React  from 'react';
import {deepPurpleA700} from 'material-ui/styles/colors';

import Google from "./Google";
import Dropbox from "./Dropbox";
import Imgur from "./Imgur";

const styles = {
    container: {
        position: 'relative'
    },
    img: {
        maxWidth: 150
    },
    block: {
        marginBottom: 20
    },
    blocks: {
        margin: 20
    }
}

export default class ProviderBlock extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            enabledSites: {
                'google': true,
                'dropbox': true,
                'imgur': true
            }
        };
    };

    getBlockType = (type) => {
        switch (type) {
            case 'google':
                if (this.state.enabledSites['google']) {
                    return Google;
                    break;
                }
            case 'dropbox':
                if (this.state.enabledSites['dropbox']) {
                    return Dropbox;
                    break;
                }
            case 'imgur':
                if (this.state.enabledSites['imgur']) {
                    return Imgur;
                    break;
                }
            default:
                return false;
        }
    }

    getBlockTemplate = (key, BlockType, providerSite = false) => {
        return (
            <div className="col-xs-12 col-sm-6 col-md-4"
                 key={key} style={styles.block}>
                <div className="box">
                    <BlockType providerSite={providerSite}/>
                </div>
            </div>
        );
    }

    render() {
        let finalBlocks = [];

        // loop through providers which havn't been verified
        Object.keys(this.state.enabledSites).map((key) => {
            let tempSite = this.state.enabledSites[key];

            // get the correct block
            let BlockType = this.getBlockType(key);
            if (!BlockType) {
                // not found
                return false;
            }

            let providerSite = false;
            if (this.props.provider_sites[key]) {
                providerSite = this.props.provider_sites[key];
            }

            // add to the list
            finalBlocks.push(this.getBlockTemplate(key, BlockType, providerSite));
        })

        return (
            <div className="row center-xs" style={styles.blocks}>
                {finalBlocks}
            </div>
        );
    };
}