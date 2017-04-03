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
    block: {
        marginBottom: 20
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

    getBlockTemplate = (key, siteInfo, userSiteInfo = false) => {
        return (
            <div className="col-xs-12 col-sm-6 col-md-4 col-lg-3"
                 key={key} style={styles.block}>
                <div className="box">
                    <ProviderBlock
                        siteInfo={siteInfo}
                        providerSite={userSiteInfo}/>
                </div>
            </div>
        );
    }

    render() {
        Logger.debug('re-render', this.props);

        let finalBlocks = [];
        // loop through providers which havn't been verified
        Object.keys(this.props.provider_sites_info).map((key) => {
            // site info for this site
            let siteInfo = this.props.provider_sites_info[key];

            // fallback to empty list
            let providerSite = this.props.provider_sites && this.props.provider_sites[siteInfo.key] ?
                this.props.provider_sites[siteInfo.key] : false

            // always add to the list
            finalBlocks.push(
                this.getBlockTemplate(
                    key,
                    siteInfo,
                    providerSite
                )
            );
        })

        return (
            <div className="row center-xs" style={styles.blocks}>
                {finalBlocks}
            </div>
        );
    }
}
