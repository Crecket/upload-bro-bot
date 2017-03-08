import React from 'react';
import muiThemeable from 'material-ui/styles/muiThemeable';

import PaperHelper from './PaperHelper';
import TitleBar from "./TitleBar";
import Center from './Center';

const styles = {
    wrapper: {
        marginTop: 30
    },
    box: {
        margin: 'auto',
        marginTop: 10,
        padding: 5,
        textAlign: 'center'
    },
    logo: {
        maxHeight: 90,
        maxWidth: 90
    }
};

class SiteList extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    };

    renderFeature(key, site) {
        return (
            <div className="col-xs-12 col-sm-6 col-md-4" key={key}>
                <PaperHelper className="box" style={styles.box}>
                    <div className="row">

                        <div className="col-xs-12 col-sm-4">
                            <Center>
                                <img style={styles.logo} src={site.logoUrl}/>
                            </Center>
                        </div>

                        <div className="col-xs-12 col-sm-8">
                            <div className="box">
                                <h3>{site.title}</h3>
                                {site.description}
                            </div>
                        </div>

                    </div>
                </PaperHelper>
            </div>
        );
    }

    render() {
        const siteComponents = this.props.sites.map((site, key) => {
            return this.renderFeature(key, site);
        });

        return (
            <div style={styles.wrapper}>
                <div className="row center-xs">
                    <div className="col-xs-12">
                        <PaperHelper className="box">
                            <TitleBar>
                                Supported Services
                            </TitleBar>
                        </PaperHelper>
                    </div>
                    {siteComponents}
                </div>
            </div>
        );
    };
}

export default muiThemeable()(SiteList);