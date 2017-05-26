import React from "react";
import muiThemeable from "material-ui/styles/muiThemeable";
import Paper from "material-ui/Paper";
import TitleBar from "./Sub/TitleBar";

const styles = {
    wrapper: {
        marginTop: 10
    },
    contentRow: {
        alignItems: "center",
        justifyContent: "center",
        height: "100%"
    },
    box: {
        width: "100%",
        marginTop: 5,
        padding: 5,
        textAlign: "center"
    },
    boxWrapper: {
        display: "flex"
    },
    logo: {
        height: 90
    }
};

class SiteList extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    renderFeature(key, site) {
        return (
            <div
                className="col-xs-12 col-sm-6 col-md-4"
                style={styles.boxWrapper}
                key={key}
            >
                <Paper className="box" style={styles.box}>
                    <div className="row" style={styles.contentRow}>
                        <img
                            style={styles.logo}
                            src={site.logos["svg"]}
                            alt={site.name + " logo"}
                        />
                        <div className="col-xs-12 col-sm-8">
                            <div className="box">
                                <h3>{site.title}</h3>
                                {site.description}
                            </div>
                        </div>
                    </div>
                </Paper>
            </div>
        );
    }

    render() {
        const siteComponents = Object.keys(this.props.sites).map(key => {
            return this.renderFeature(key, this.props.sites[key]);
        });

        return (
            <div style={styles.wrapper}>
                <div className="row center-xs">
                    <div className="col-xs-12">
                        <Paper className="box">
                            <TitleBar>
                                Supported Services
                            </TitleBar>
                        </Paper>
                    </div>
                    {siteComponents}
                </div>
            </div>
        );
    }
}

export default muiThemeable()(SiteList);
