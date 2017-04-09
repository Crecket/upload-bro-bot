import React  from 'react';

import ProviderBlock from './ProviderBlock.jsx';
import Logger from "../../Helpers/Logger";

const styles = {
    container: {
        position: 'relative'
    },
    img: {
        maxWidth: 150
    },
    blocks: {
        margin: 20
    }
}

export default class ProviderBlocks extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    render() {
        let finalBlocks = [];
        // loop through providers which havn't been verified
        Object.keys(this.props.provider_sites).map((key) => {
            // site info for this site
            let siteInfo = this.props.provider_sites[key];

            // fallback to empty list
            let userSiteInfo = this.props.user_provider_sites && this.props.user_provider_sites[siteInfo.key] ?
                this.props.user_provider_sites[siteInfo.key] : false

            // always add to the list
            finalBlocks.push(
                <ProviderBlock
                    key={key}
                    siteInfo={siteInfo}
                    userSiteInfo={userSiteInfo}/>
            );
        })

        return (
            <div className="row center-xs" style={styles.blocks}>
                {finalBlocks}
            </div>
        );
    }
}
