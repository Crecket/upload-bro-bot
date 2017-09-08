import React from "react";
import AppBar from "material-ui/AppBar";
import Drawer from "material-ui/Drawer";
import TextField from "material-ui/TextField";

class DrawerDebugger extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            open: false
        };
    }

    componentDidMount() {
        if (!process.env.DEBUG) return null;

        window.drawerDebugger = process.env.DEBUG
            ? this.toggleDrawer
            : () => {};

        // Logger.debug(this.props.theme);
    }

    toggleDrawer = () => {
        this.setState({ open: !this.state.open });
    };

    render() {
        if (!process.env.DEBUG) return null;

        return (
            <Drawer open={this.state.open}>
                <AppBar title="AppBar" onClick={this.toggleDrawer} />
                <TextField
                    key="input"
                    name="asdfaf123"
                    ref="asdfaf123"
                    hintText="Hint Text"
                    floatingLabelText="Fixed Floating Label Text"
                    floatingLabelFixed={true}
                />
                <br />
            </Drawer>
        );
    }
}

export default DrawerDebugger;
