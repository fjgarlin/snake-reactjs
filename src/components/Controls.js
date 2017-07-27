import React, { Component } from 'react';

class Controls extends Component {
    render() {
        return (
            <div className="Controls">
                <p>
                    Use the arrow keys to play:
                    <i className="key fa fa-arrow-left" aria-hidden="true"></i>
                    <i className="key fa fa-arrow-up" aria-hidden="true"></i>
                    <i className="key fa fa-arrow-right" aria-hidden="true"></i>
                    <i className="key fa fa-arrow-down" aria-hidden="true"></i>
                </p>
                <div className="btn-group" role="group" aria-label="Basic example">
                    <button type="button" className="btn btn-secondary" onClick={this.props.newGame}>
                        <i className="fa fa-refresh" aria-hidden="true"></i>
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={this.props.pauseGame}>
                        {!this.props.gamePaused ? <i className="fa fa-play" aria-hidden="true"></i> : null }
                        {this.props.gamePaused ? <i className="fa fa-pause" aria-hidden="true"></i> : null }
                    </button>
                </div>
            </div>
        );
    }
}

export default Controls;