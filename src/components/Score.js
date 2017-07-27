import React, { Component } from 'react';

class Score extends Component {
    render() {
        return (
            <div className="Score">
                <h2>Length: <span className="badge badge-default">{this.props.length}</span></h2>
            </div>
        );
    }
}

export default Score;