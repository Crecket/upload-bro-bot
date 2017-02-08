import React  from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';

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
                {/*<a href={this.props.url} target="_blank">*/}
                <img style={styles.img}
                     src={this.props.img}/>
                <br/>
                <RaisedButton
                    primary={true}
                    href={this.props.url}
                    style={styles.popout}>
                    <div >
                        {this.props.title}
                    </div>
                </RaisedButton>
                {/*</a>*/}
            </div>
        );
    };
}