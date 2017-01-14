import React from "react";
import FlatButton from "material-ui/FlatButton";
import InputIcon from "material-ui/svg-icons/action/input";

import RequireNotLogin from "../Helpers/RequireNotLogin";

class Login extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            levelData: false,
            level_name: ""
        };
    };

    componentDidMount() {
        RequireNotLogin(this.props, true);
    };

    shouldComponentUpdate(nextProps, nextState) {
        RequireNotLogin(nextProps, true);
        return true;
    }

    render() {
        return (
            <div style={{textAlign: 'center', margin: 40}}>

                <FlatButton
                    label="Click here to login"
                    icon={<InputIcon/>}
                    style={{backgroundColor: '#FB6405'}}
                />
            </div>
        );
    };
}

export default Login;