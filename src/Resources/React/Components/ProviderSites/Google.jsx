import React  from 'react';

import ProviderBlock from './ProviderBlock';

export default class Google extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    };

    render() {
        return (
            <ProviderBlock
                providerSite={this.props.providerSite}
                url="/login/google"
                urlInfo="https://drive.google.com/"
                img="/assets/img/google.png"
                title="Google Drive"/>
        );
    };
}