import React from "react";
import Paper from "material-ui/Paper";
import Check from 'material-ui/svg-icons/navigation/check';
import Error from 'material-ui/svg-icons/alert/error';
import {red500, green800} from 'material-ui/styles/colors';
import {browserHistory}  from 'react-router';

import Utils from '../Helpers/Utils';

const styles = {
    img: {
        maxHeight: 120,
        padding: 20
    },
    button: {
        width: '100%'
    },
    inputs: {
        width: '100%',
    },
    paperWrapper: {
        marginTop: 40,
        textAlign: 'center'
    },
    paper: {
        width: '100%',
        padding: 20,
        textAlign: 'center',
        display: 'inline-block',
    },
    checkIcon: {
        width: 60,
        height: 60,
        color: green800
    },
    errorIcon: {
        width: 60,
        height: 60,
        color: red500
    }
};

export default class ProviderLogin extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    };

    componentDidMount() {
        setTimeout(() => {
            browserHistory.push('/');
        }, 2000);
    }

    render() {
        let removeDiv = (
            <h3>
                <Error style={styles.errorIcon}/>
                <br/>
                Something went wrong
            </h3>
        )
        if (this.props.user_info &&
            this.props.user_info.provider_sites &&
            this.props.user_info.provider_sites[this.props.params.type]) {
            removeDiv = (
                <h3>
                    <Check style={styles.checkIcon}/>
                    <br/>
                    Successfully logged in to your {Utils.ucfirst(this.props.params.type)} account!
                </h3>
            )
        }

        return (
            <div style={styles.paperWrapper}
                 className="col-xs-12 col-md-8 col-md-offset-2 col-lg-6 col-lg-offset-3">
                <Paper style={styles.paper}>

                    {removeDiv}
                </Paper>
            </div>
        );
    };
}