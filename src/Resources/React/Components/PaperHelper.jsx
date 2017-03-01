import React from "react";
import Paper from "material-ui/Paper";
import muiThemeable from 'material-ui/styles/muiThemeable';

class PaperHelper extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    };

    render() {
        // let bgColor = this.props.bg ? this.props.bg : this.props.muiTheme.custom.appBackgroundColor;
        let bgColor = '#FFFFFF';
        return (
            <Paper style={{backgroundColor: bgColor}}
                   {...this.props}>
                {this.props.children}
            </Paper>
        );
    };
}

export default PaperHelper;