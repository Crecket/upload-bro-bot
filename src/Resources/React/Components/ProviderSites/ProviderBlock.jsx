import React  from 'react';

import Paper from 'material-ui/Paper';

const styles = {
    container: {
        position: 'relative',
        'transformStyle': 'preserve-3d'
    },
    img: {
        maxWidth: 120,
        maxHeight: 120
    },
    popout: {
        'transform': 'translateZ(20px)'
    }
}

export default class ProviderBlock extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    };

    render() {
        return (
            <div style={styles.container} class="your-element">
                <img style={styles.img}
                     src={this.props.img}/>
                <br/>
                <div style={styles.popout}>
                    {this.props.title}
                </div>
            </div>
        );
    };
}