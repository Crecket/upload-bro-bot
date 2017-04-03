import React from 'react';
import muiThemeable from 'material-ui/styles/muiThemeable';

import PaperHelper from './Sub/PaperHelper';
import TitleBar from "./Sub/TitleBar";
import Center from './Sub/Center';

const styles = {
    wrapper: {
        marginTop: 30
    },
    box: {
        margin: 'auto',
        marginTop: 10,
        minHeight: 145,
        padding: 5,
        textAlign: 'center'
    },
    logo: {
        height: 90
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
                                <img style={styles.logo} src={site.logos['svg']}/>
                            </Center>
                        </div>

                        <div className="col-xs-12 col-sm-8">
                            <div className="box">
                                <h3>{site.title}</h3>
                                {site.slogan}
                            </div>
                        </div>

                    </div>
                </PaperHelper>
            </div>
        );
    }

    render() {
        const siteComponents = Object.keys(this.props.sites).map((key) => {
            return this.renderFeature(key, this.props.sites[key]);
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
