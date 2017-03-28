import React from 'react';

class NotFound extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    };

    render() {
        return (
            <div style={{textAlign: 'center', marginTop: 40}}>
                <h1>Page Not Found</h1>
            </div>
        );
    };
}

export default NotFound;