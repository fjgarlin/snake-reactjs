import React, { Component } from 'react';
import Score from './Score';
import Controls from './Controls';
import Utils from './Utils';

class Snake extends Component {
    constructor(props) {
        super(props);

        this.state = {
            snakeLength: 1,
            gameStatus: false,
            snakeCoords: [
                Utils.random(0, this.props.xSize),
                Utils.random(0, this.props.ySize),
            ],
            currentDirection: [0, 1]
        }
    }

    resetGame() {
        console.log('resetting game...');
        this.setState({
            snakeLength: 1,
            gameStatus: false,
            snakeCoords: [
                Utils.random(0, this.props.xSize),
                Utils.random(0, this.props.ySize),
            ],
            currentDirection: [0, 1]
        });
    }

    pauseGame() {
        console.log('pausing game...');
        this.setState({ gameStatus: !this.state.gameStatus });
    }

    moveSnake() {

    }

    render() {
        return (
            <div>
                <Score length={this.state.snakeLength} />
                <div className="Snake square">

                </div>
                <Controls
                    gamePaused={this.state.gameStatus}
                    newGame={this.resetGame.bind(this)}
                    pauseGame={this.pauseGame.bind(this)}
                />
            </div>
        );
    }
}

Snake.defaultProps = {
    color: 'blue',
    xSize: 20,
    ySize: 20,
    keys: {
        left: 37,
        up: 38,
        right: 39,
        down: 40
    }
};

export default Snake;