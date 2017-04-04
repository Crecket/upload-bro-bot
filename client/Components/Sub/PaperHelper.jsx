import React from "react";
import Paper from "material-ui/Paper";

class PaperHelper extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    render() {
        return (
            <Paper {...this.props}>
                {this.props.children}
            </Paper>
        );
    }
}

export default PaperHelper;
