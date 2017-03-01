import React from 'react';

const styles = {
    h1: {
        color: 'rgb(48, 63, 159)'
    }
}

class TitleBar extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    };

    render() {
        return (
            <div class="row center-xs">
                <h1 style={styles.h1} {...this.props}>
                    {this.props.children}
                </h1>
            </div>
        );
    };
}

export default  TitleBar;