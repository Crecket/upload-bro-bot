import React  from 'react';

import ProviderBlock from './ProviderBlock';

export default class Dropbox extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    };

    render() {
        return (
            <ProviderBlock
                providerSite={this.props.providerSite}
                url="/login/dropbox"
                urlInfo="https://www.dropbox.com/"
                img="/assets/img/dropbox.png"
                title="Dropbox"/>
        );
    };
}