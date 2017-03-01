import React from 'react';

import PaperHelper from './PaperHelper';

const styles = {
    paper: {
        padding: '5px'
    },
    box: {
        margin: 'auto',
        marginTop: '10px',
        textAlign: 'left'
    },
};

export default class FeatureList extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    };

    renderFeature(key, icon, title, description) {
        return (
            <PaperHelper className="col-xs-12 col-sm-6 col-md-4 col-lg-3" key={key}>
                <div className="box" style={styles.box}>
                    {icon}
                    <h4>
                        {title}
                    </h4>
                    <p>
                        {description}
                    </p>
                </div>
            </PaperHelper>
        );
    }

    render() {
        const featureList = [
            {
                icon: "Instant upload",
                title: "Instant upload",
                description: "Upload any file you want to a number of services"
            },
            {
                icon: "Instant upload",
                title: "Instant upload",
                description: "Upload any file you want to a number of services"
            },
            {
                icon: "Instant upload",
                title: "Instant upload",
                description: "Upload any file you want to a number of services"
            },
            {
                icon: "Instant upload",
                title: "Instant upload",
                description: "Upload any file you want to a number of services"
            }
        ];

        const featureComponents = featureList.map((value, key) => {
            return this.renderFeature(key, value.icon, value.title, value.description);
        });

        return (
            <div>
                <div className="row center-xs">
                    {featureComponents}
                </div>
            </div>
        );
    };
}