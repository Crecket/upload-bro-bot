import React  from 'react';

import Google from "./Google";
import Dropbox from "./Dropbox";
import Paper from 'material-ui/Paper';

const styles = {
    container: {
        position: 'relative'
    },
    img: {
        maxWidth: 150
    }
}

export default class ProviderBlock extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    };

    getBlockType = (type) => {
        console.log(type);
        switch (type) {
            case 'google':
                return Google;
                break;
            case 'dropbox':
                return Dropbox;
                break;
            default:
                return false;
        }
    }

    render() {
        let finalBlocks = [];
        // loop through providers
        Object.keys(this.props.provider_sites).map((key) => {
            let tempSite = this.props.provider_sites[key];

            // get the correct block
            let BlockType = this.getBlockType(key);
            if (!BlockType) {
                // not found
                return false;
            }

            // add to the list
            finalBlocks.push((
                <div className="col-xs-12 col-sm-8 col-md-6 col-lg-4" key={key}>
                    <div className="box">
                        <BlockType />
                    </div>
                </div>
            ))
        })

        return (
            <div className="row center-xs">
                {finalBlocks}
            </div>
        );
    };
}