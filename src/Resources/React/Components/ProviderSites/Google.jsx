import React  from 'react';

import ProviderBlock from './ProviderBlock';

export default class Google extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    };

    render() {
        return (
            <div>
                <ProviderBlock
                    img="/assets/img/google-drive.png"
                    title="Google Drive"/>
            </div>
        );
    };
}