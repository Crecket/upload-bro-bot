import React from 'react';

const styles = {
    h1: {
        color: '#fff'
    }
}

class TitleBar extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    };

    render() {
        return (
            <div class="col-xs-12">
                <h1 style={{color: 'rgb(48, 63, 159)'}} {...this.props}>
                    {this.props.children}
                </h1>
            </div>
        );
    };
}

export default  TitleBar;