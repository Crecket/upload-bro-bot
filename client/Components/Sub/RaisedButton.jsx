import React from 'react'
import RaisedButton from 'material-ui/RaisedButton';

export default React.createClass({
    render() {
        // if (this.props.warning && this.props.warning === true) {
        //     return <RaisedButton {...this.props} className='warningBtn'/>;
        // }
        // if (this.props.danger && this.props.danger === true) {
        //     return <RaisedButton {...this.props} className='dangerBtn'/>;
        // }
        if (!this.props.secondary && !this.props.primary) {
            return <RaisedButton {...this.props} className='defaultBtn'/>;
        }
        return <RaisedButton {...this.props}/>;
        // (!this.props.secondary && !this.props.primary)
    }
})
