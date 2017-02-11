import React  from 'react';

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
        this.state = {};
    };

    getBlockType = (type) => {
        switch (type) {
            case 'google':
                return Google;
                break;
            case 'dropbox':
                return Dropbox;
                break;
            case 'imgur':
                return Imgur;
                break;
            default:
                return false;
        }
    }

    render() {
        let finalBlocks = [];

        // this.props.provider_sites['imgur'] = true;

        // loop through providers
        Object.keys(this.props.provider_sites).map((key) => {
            // get the correct block
            let BlockType = this.getBlockType(key);
            if (!BlockType) {
                // not found
                return false;
            }

            // add to the list
            finalBlocks.push((
                <div className="col-xs-12 col-sm-6 col-md-4"
                     key={key} style={styles.block}>
                    <div className="box">
                        <BlockType />
                    </div>
                </div>
            ))
        })

        return (
            <div className="row center-xs" style={styles.blocks}>
                {finalBlocks}
            </div>
        );
    };
}