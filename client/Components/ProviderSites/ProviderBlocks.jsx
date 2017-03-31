import React  from 'react';
import {connect} from "react-redux";

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

import ProviderBlock from './ProviderBlock.jsx';

// actions
import {openModal, closeModal} from "../../Actions/modalActions.js";

// connect to redux
@connect((store) => {
    return {
        modalText: store.modal.message,
        modalTitle: store.modal.title,
        modalOpen: store.modal.modalOpen,
    };
})
export default class ProviderBlocks extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    };

    openModal = (message, title) => {
        this.props.dispatch(openModal(message, title));
    }

    getBlockTemplate = (key, siteInfo, userSiteInfo = false) => {
        return (
            <div className="col-xs-12 col-sm-6 col-md-4"
                 key={key} style={styles.block}>
                <div className="box">
                    <ProviderBlock
                        showModal={this.openModal}
                        siteInfo={siteInfo}
                        providerSite={userSiteInfo}/>
                </div>
            </div>
        );
    }

    render() {
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
    };
}